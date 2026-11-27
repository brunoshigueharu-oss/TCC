import { Color, MeshPhysicalMaterial, ShaderChunk, ShaderMaterial, type Texture } from "three";

import { lerp } from "@/lib/math";

import type { OrbPalette } from "./palette";
import { createBlobBumpTexture, createFilmThicknessTexture } from "./textures";

/**
 * Vidro físico da esfera (e das letras de vidro de BASE8, em `lib/letters`):
 * refrata o que está atrás e dentro dele e reflete o estúdio. O mesmo
 * material faz três papéis, só mudando as propriedades:
 *
 *   bolinha de gude  vidro grosso (refrata forte), quase incolor e levemente ondulado
 *   bolha de sabão   película sem espessura, com as cores de interferência
 *   cúpula da bússola  vidro fino e limpo
 */

/** Índice de refração do vidro comum. */
const GLASS_IOR = 1.5;
/** Película de sabão: quase não desvia a luz (1 = ar). */
const FILM_IOR = 1.02;
/** Índice de refração da água com sabão, que decide as cores da película. */
const SOAP_IOR = 1.33;
/** Espessura da película, em nanômetros: do topo (fina) à base (grossa). */
const FILM_THICKNESS_RANGE: [number, number] = [90, 760];
/** Distância que a luz percorre no vidro até pegar a cor do tingimento. */
const TINT_DISTANCE = 0.8;
/** Quanto o azul da marca é clareado para virar a cor do vidro. */
const TINT_LIGHTEN = 0.78;
/** Quão rente à borda o contorno fica (maior = mais fino): largo no vidro, um fio na bolha. */
const RIM_SHARPNESS = { glass: 3, film: 7 } as const;
/**
 * Mínimo de iridescência. Nunca zera porque ligar/desligar o efeito faz o
 * three recompilar o material no meio da rolagem (um tranco visível).
 */
const IRIDESCENCE_FLOOR = 0.001;
/**
 * Força do reflexo do estúdio. Vidro reflete só 4% da luz; numa foto os
 * painéis são tão fortes que mesmo assim estouram. Aqui o reflexo é reforçado
 * no próprio vidro, sem superexpor o resto da cena. A película da bolha, no
 * escuro, precisa de muito reflexo para as cores aparecerem; no claro, quase
 * nenhum, senão vira uma pérola leitosa (bolha no claro é quase invisível).
 */
const REFLECTION = { marble: 2.4, dome: 1.1, filmOnDark: 4.5, filmOnLight: 1.2 } as const;
/** Acima disso o fundo da página conta como claro. */
const LIGHT_BACKGROUND_ABOVE = 0.5;
/**
 * A película deixa passar um pouco menos de luz (a parte que ela reflete).
 * Sem isso o reflexo colorido soma sobre o branco da página e desaparece.
 */
const FILM_SHADE = "#f0f2f6";
/**
 * Vidro soprado não é uma esfera perfeita: a superfície tem ondulações leves,
 * que entortam um pouco o que se vê através dela e quebram os reflexos.
 */
const GLASS_WAVINESS = 0.9;
/** As cores da película vão e voltam de leve, sem sair do lugar (o 8 fica de frente). */
const FILM_DRIFT = { distance: 0.012, perSecond: 0.35 } as const;

/**
 * Contorno escuro do vidro. Uma esfera de vidro de verdade mostra, na borda, o
 * ambiente invertido e escuro; a refração do three só enxerga o que está na
 * tela, então esse escurecimento é pintado por cima, rente à borda.
 */
const rimVertexShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -viewPosition.xyz;
    vViewNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const rimFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  uniform float uSharpness;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    float facing = clamp(dot(normalize(vViewNormal), normalize(vViewPosition)), 0.0, 1.0);
    gl_FragColor = vec4(uColor, pow(1.0 - facing, uSharpness) * uStrength);
    #include <colorspace_fragment>
  }
`;

/**
 * Trechos do shader de refração do three que são trocados. As trocas valem
 * nos dois perfis: com fundo pintado (estúdio) não há transparência atrás do
 * vidro e o resultado é o mesmo do three; com canvas transparente por cima da
 * página (landing) elas é que impedem a esfera de sair leitosa. Se uma versão
 * nova do three reescrever esses trechos, a troca deixa de acontecer e o
 * vidro volta a sair leitoso na landing.
 *
 * Sem fundo pintado, o three preenche o que o vidro "vê" com branco a 50% de
 * opacidade. A leitura desfaz esse preenchimento: o que era fundo volta a ser
 * transparente, o que era objeto atrás do vidro continua opaco.
 */
const TRANSMISSION_SAMPLE = "transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );";
const TRANSMISSION_SAMPLE_UNFILLED = /* glsl */ `
  ${TRANSMISSION_SAMPLE}
  float solidBehind = clamp( transmittedLight.a * 2.0 - 1.0, 0.0, 1.0 );
  transmittedLight = vec4( max( transmittedLight.rgb - ( 1.0 - solidBehind ), 0.0 ), solidBehind );
`;
/**
 * Onde há página atrás, o vidro sai com a transparência do seu canal mais
 * claro e soma a cor da página tingida por ele; o navegador completa com a
 * página de verdade. Na prática o vidro tinge a página e soma os reflexos.
 */
const TRANSMISSION_RESULT =
  "return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );";
const TRANSMISSION_RESULT_TINTING_PAGE = /* glsl */ `
  // O navegador mistura o canvas com a página já em cores de tela (sRGB), não
  // em luz. Então a conta é feita em cores de tela: como a página deveria
  // ficar vista pelo vidro, dividida em "quanto dela passa" (a transparência)
  // e "que cor sobra por cima" (o tom do vidro).
  vec3 pageOnScreen = sRGBTransferOETF( vec4( uPageColor, 1.0 ) ).rgb;
  vec3 pageThroughGlass = sRGBTransferOETF( vec4( transmittance * uPageColor, 1.0 ) ).rgb;
  vec3 passing = pageThroughGlass / max( pageOnScreen, vec3( 0.0001 ) );
  float clearest = min( passing.r, min( passing.g, passing.b ) );
  vec3 tintOnScreen = ( passing - clearest ) * pageOnScreen * ( 1.0 - transmittedLight.a );
  vec3 pageTint = sRGBTransferEOTF( vec4( tintOnScreen, 1.0 ) ).rgb;
  return vec4( ( 1.0 - F ) * attenuatedColor + pageTint, 1.0 - ( 1.0 - transmittedLight.a ) * clearest );
`;
/**
 * Película de sabão que absorve: a cor que a película reflete é a cor que
 * deixa de atravessá-la. No branco o reflexo não aparece (nada fica mais claro
 * que papel branco), mas a página vista através da bolha pega o tom
 * complementar, e é assim que as faixas de cor continuam visíveis no tema
 * claro. A força vem de `filmAbsorption` do perfil (0 = nada muda).
 */
const FILM_CALL = "n, v, material.roughness, material.diffuseContribution,";
const FILM_CALL_ABSORBING = "n, v, material.roughness, material.diffuseContribution * filmPassing,";
const FILM_PASSING = /* glsl */ `
  vec3 filmPassing = vec3( 1.0 );
  #ifdef USE_IRIDESCENCE
    if ( material.iridescence > 0.0 ) {
      filmPassing -= clamp( material.iridescenceFresnel * material.iridescence * uFilmAbsorption, 0.0, 0.85 );
    }
  #endif
`;

/** O que muda no vidro conforme o que está atrás do canvas. */
export type GlassProfile = {
  /** Tom da gude (o vidro grosso): branco = incolor. */
  marbleShade: string;
  /** Multiplica a força do contorno escuro na borda. */
  rimBoost: number;
  /** Quanto a cor do vidro escurece para virar a cor do contorno (menor = mais escuro). */
  rimDarken: number;
  /** Quanto a película tinge a página, em relação ao que a física daria (1); 0 = não tinge. */
  filmAbsorption: number;
};

export const GLASS_PROFILES = {
  /**
   * Canvas transparente por cima da página (landing). Não há curva de
   * exposição escurecendo o que se vê através do vidro: a gude ganha um tom
   * próprio, leve, para ter corpo no fundo branco; o contorno, que é o que
   * desenha a esfera no branco, fica mais firme e mais escuro; e a película
   * tinge a página.
   */
  page: { marbleShade: "#dde4ee", rimBoost: 1.5, rimDarken: 0.2, filmAbsorption: 1.6 },
  /** Fundo pintado na cor da página (a página de estudo `/orbe`). */
  studio: { marbleShade: "#ffffff", rimBoost: 1, rimDarken: 0.4, filmAbsorption: 0 },
} as const satisfies Record<string, GlassProfile>;

export type GlassLook = {
  /** 1 = vidro grosso da bolinha de gude. */
  tint: number;
  /** 1 = película de sabão. */
  film: number;
  /** Espessura do vidro, em raios da esfera. */
  thickness: number;
  /** Força do contorno escuro na borda. */
  rim: number;
  /** Desgaste da superfície: micro-riscos e poeira que quebram o reflexo perfeito. */
  wear: number;
  time: number;
};

export function createGlass(palette: OrbPalette, scuffs: Texture, profile: GlassProfile) {
  const clear = new Color("#ffffff");
  const marbleShade = new Color(profile.marbleShade);
  const pageColor = new Color(palette.fundo);
  const tinted = new Color(palette.comunidade).lerp(clear, TINT_LIGHTEN);
  const filmShade = new Color(FILM_SHADE);
  const isLightPage = new Color(palette.fundo).getHSL({ h: 0, s: 0, l: 0 }).l > LIGHT_BACKGROUND_ABOVE;
  const filmReflection = isLightPage ? REFLECTION.filmOnLight : REFLECTION.filmOnDark;
  const filmTexture = createFilmThicknessTexture();
  const waviness = createBlobBumpTexture(77, 420, 46);
  waviness.repeat.set(3, 2);

  const material = new MeshPhysicalMaterial({
    color: clear.clone(),
    roughness: 0,
    // Vidro nenhum é perfeito: os riscos de uso aparecem dentro dos brilhos.
    roughnessMap: scuffs,
    transmission: 1,
    ior: GLASS_IOR,
    thickness: 1,
    attenuationColor: tinted.clone(),
    attenuationDistance: TINT_DISTANCE,
    iridescence: IRIDESCENCE_FLOOR,
    iridescenceIOR: SOAP_IOR,
    iridescenceThicknessRange: FILM_THICKNESS_RANGE,
    iridescenceThicknessMap: filmTexture,
    bumpMap: waviness,
    bumpScale: GLASS_WAVINESS,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uPageColor = { value: pageColor };
    shader.uniforms.uFilmAbsorption = { value: profile.filmAbsorption };
    const refraction = ShaderChunk.transmission_pars_fragment
      .replace(TRANSMISSION_SAMPLE, TRANSMISSION_SAMPLE_UNFILLED)
      .replace(TRANSMISSION_RESULT, TRANSMISSION_RESULT_TINTING_PAGE);
    const transmission = ShaderChunk.transmission_fragment
      .replace("vec4 transmitted = getIBLVolumeRefraction(", `${FILM_PASSING}\n\tvec4 transmitted = getIBLVolumeRefraction(`)
      .replace(FILM_CALL, FILM_CALL_ABSORBING);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <transmission_pars_fragment>", `uniform vec3 uPageColor;\nuniform float uFilmAbsorption;\n${refraction}`)
      .replace("#include <transmission_fragment>", transmission);
  };

  const rimTinted = tinted.clone().multiplyScalar(profile.rimDarken);
  const rimClear = new Color(palette.contorno);
  const rimMaterial = new ShaderMaterial({
    vertexShader: rimVertexShader,
    fragmentShader: rimFragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: rimClear.clone() },
      uStrength: { value: 0 },
      uSharpness: { value: RIM_SHARPNESS.glass },
    },
  });

  return {
    material,
    rimMaterial,
    setLook(look: GlassLook) {
      (rimMaterial.uniforms.uColor.value as Color).lerpColors(rimClear, rimTinted, look.tint);
      rimMaterial.uniforms.uStrength.value = look.rim * profile.rimBoost;
      rimMaterial.uniforms.uSharpness.value = lerp(RIM_SHARPNESS.glass, RIM_SHARPNESS.film, look.film);
      material.ior = lerp(GLASS_IOR, FILM_IOR, look.film);
      material.thickness = look.thickness;
      material.roughness = look.wear;
      material.bumpScale = GLASS_WAVINESS * look.tint;
      material.color.lerpColors(clear, marbleShade, look.tint).lerp(filmShade, look.film);
      material.envMapIntensity = lerp(lerp(REFLECTION.dome, REFLECTION.marble, look.tint), filmReflection, look.film);
      material.iridescence = Math.max(IRIDESCENCE_FLOOR, look.film);
      material.attenuationColor.lerpColors(clear, tinted, look.tint);
      filmTexture.offset.x = Math.sin(look.time * FILM_DRIFT.perSecond) * FILM_DRIFT.distance;
    },
    dispose() {
      filmTexture.dispose();
      waviness.dispose();
      material.dispose();
      rimMaterial.dispose();
    },
  };
}
