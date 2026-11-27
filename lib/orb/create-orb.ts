import {
  BufferGeometry,
  Euler,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  Texture,
  WebGLRenderTarget,
  type Camera,
  type Scene,
  type WebGLRenderer,
} from "three";

import { clamp, lerp, smoothstep } from "@/lib/math";
import { createGlass, GLASS_PROFILES, type GlassProfile } from "@/lib/three-materials/glass";
import type { OrbPalette } from "@/lib/three-materials/palette";
import { createScuffTexture, FULL_TEXTURES, type TextureSettings } from "@/lib/three-materials/textures";

import { createAirBubbles, createCompass, createEightBall, createSwirl } from "./orb-parts";
import { createTennisBall } from "./orb-tennis";
import { easeOrbProgress, ORB_FIT_SIZE, sampleTrack, type OrbTrack } from "./orb-timeline";

/**
 * Monta o render 3D e o atualiza a cada quadro. Não depende do React: quem
 * usa só coloca `root` na cena e chama `update` com o progresso da rolagem.
 *
 * A transformação é contínua, não uma troca de modelos:
 *   gude → bolha     o vidro afina até virar película e infla; os fios se desfazem
 *   bolha → bússola  a bolha achata e vira a cúpula; a bússola cresce dentro
 *   bússola → bola 8 a bola preta incha por trás do mostrador e engole tudo
 *   bola 8 → tênis   a laca se desfaz em grãos e o feltro cresce
 *
 * O 8 nunca é um objeto à parte; em cada forma ele é um detalhe do próprio
 * material: a silhueta dos fios torcidos na gude, o desenho das faixas de cor
 * na bolha, o ornamento do mostrador, o número da bola 8 e a estampa da bola
 * de tênis.
 */

/** Trilhas: um valor por objeto (gude, bolha, bússola, bola 8, tênis). */
const TRACKS = {
  glassScale: [1, 1.32, 0.93, 1.006, 1.006],
  /** Achatamento no eixo da câmera (1 = esfera). */
  glassFlatten: [1, 1, 0.3, 1, 1],
  glassTint: [1, 0, 0, 0, 0],
  glassFilm: [0, 1, 0.02, 0, 0],
  glassThickness: [0.5, 0, 0.12, 0.05, 0.05],
  glassRim: [0.55, 0.6, 0.2, 0, 0],
  /** Micro-riscos: a gude é um pouco usada, a bolha é perfeita, a cúpula da bússola é a mais gasta. */
  glassWear: [0.035, 0, 0.1, 0.1, 0.1],
  swirlScale: [1, 1.5, 1.5, 1.5, 1.5],
  swirlOpacity: [1, 0, 0, 0, 0],
  compassScale: [0, 0, 1, 0.5, 0.5],
  /** Até a bússola, a bola existe fina e um pouco menor, escondida na caixa. */
  ballScale: [0.9, 0.9, 0.9, 1, 1],
  ballFlatten: [0.04, 0.04, 0.04, 1, 1],
  /** 0 = gira solta; 1 = fica de frente para a câmera. */
  facing: [0, 0, 1, 1, 0],
  /** Vidro e película deixam a luz passar: sombra fraca. */
  shadowOpacity: [0.38, 0.12, 0.7, 0.8, 0.7],
} satisfies Record<string, OrbTrack>;

const STAGE = { compass: 2, ball: 3 } as const;
/** Abaixo disso a peça já sumiu e sai da cena. */
const HIDDEN_BELOW = 0.01;

/**
 * Giro livre das esferas: um tanto pelo tempo, um tanto pela rolagem. Por
 * cima, dois balanços lentos e fora de compasso (inclinação e rolagem de
 * lado), para o giro não parecer de máquina.
 */
const TUMBLE = {
  tiltBase: 0.3,
  tiltPerStage: 0.9,
  turnPerStage: 2.6,
  turnPerSecond: 0.28,
  tiltWobbleAngle: 0.2,
  tiltWobblePerSecond: 0.31,
  rollWobbleAngle: 0.15,
  rollWobblePerSecond: 0.23,
} as const;
/** Pose de frente: inclinada como um objeto sobre a mesa, balançando de leve de lado e acenando um fio para a frente. */
const FACE = { tilt: -0.4, swayAngle: 0.2, swayPerSecond: 0.5, nodAngle: 0.04, nodPerSecond: 0.6 } as const;
const FLOAT = { height: 0.05, perSecond: 0.9 } as const;
/** A película da bolha não gira com ela: fica de frente, só balançando, para o desenho das faixas dar para ler. */
const FILM_WOBBLE = { turnAngle: 0.35, turnPerSecond: 0.5, tiltAngle: 0.12, tiltPerSecond: 0.4 } as const;
const NEEDLE = { swingAngle: 0.16, swingPerSecond: 1.3, turnPerStage: 2.2 } as const;
/**
 * Bola 8 → tênis, em frações do trecho: primeiro os fios do feltro brotam da
 * laca preta; a laca só se desfaz depois, já por baixo deles. A bola de tênis
 * espera um fio menor que a bola 8.
 */
const TO_TENNIS = { fuzzEnd: 0.65, dissolveStart: 0.3, dissolveEnd: 0.8, hiddenScale: 0.992 } as const;

/** Altura do "chão" onde a sombra cai, em raios da esfera. */
export const ORB_FLOOR_HEIGHT = -1.85;
/** O contorno fica um fio acima do vidro, para não disputar a mesma superfície. */
const RIM_OVERSIZE = 1.003;
/** Quantas vezes a textura de riscos se repete em cada peça. */
const SCUFF_REPEAT = [3, 2] as const;

export type OrbFrame = {
  /** 0 (bolinha de gude) a 4 (bola de tênis). */
  progress: number;
  /** Segundos de animação; fixe em 0 para quem pede menos movimento. */
  time: number;
  /** Tamanho visível da cena, em unidades do mundo, na distância do objeto. */
  viewportWidth: number;
  viewportHeight: number;
};

export type OrbOptions = {
  /**
   * Perfil do vidro (`GLASS_PROFILES`): `page` na landing, em canvas
   * transparente por cima da página; `studio` (o padrão) com fundo pintado.
   */
  glassProfile?: GlassProfile;
  /** Resolução das texturas e quando pintá-las. */
  textures?: TextureSettings;
};

export function createOrb(
  palette: OrbPalette,
  { glassProfile = GLASS_PROFILES.studio, textures = FULL_TEXTURES }: OrbOptions = {},
) {
  const root = new Group();
  const float = new Group();
  const spin = new Group();
  float.add(spin);

  const scuffs = createScuffTexture();
  scuffs.repeat.set(...SCUFF_REPEAT);

  const glass = createGlass(palette, scuffs, glassProfile);
  const glassGeometry = new SphereGeometry(1, 128, 96);
  /** Uma esfera de vidro com o seu contorno escuro. */
  const createGlassSphere = () => {
    const sphere = new Mesh(glassGeometry, glass.material);
    const rim = new Mesh(glassGeometry, glass.rimMaterial);
    rim.scale.setScalar(RIM_OVERSIZE);
    sphere.add(rim);
    return sphere;
  };
  const glassMesh = createGlassSphere();

  const swirl = createSwirl(palette);
  const air = createAirBubbles();
  const compass = createCompass(scuffs, textures);
  const ball = createEightBall(scuffs, textures);
  const tennis = createTennisBall(textures);

  spin.add(swirl.core, air.mesh, compass.group, ball.mesh, tennis.group, glassMesh);
  root.add(float);

  const tumbleEuler = new Euler();
  const faceEuler = new Euler();
  const wobbleEuler = new Euler();
  const tumble = new Quaternion();
  const face = new Quaternion();
  const unspin = new Quaternion();
  const upright = new Quaternion();
  let shadowOpacity = 0;

  return {
    root,

    /** Força da sombra de contato no quadro atual (quem desenha a sombra é a cena). */
    get shadowOpacity() {
      return shadowOpacity;
    },

    update({ progress, time, viewportWidth, viewportHeight }: OrbFrame) {
      const eased = easeOrbProgress(progress);
      const at = (track: OrbTrack) => sampleTrack(track, eased);
      /** Quanto do trecho que começa em `stage` já foi percorrido (0 a 1). */
      const through = (stage: number) => clamp(eased - stage, 0, 1);
      const toTennis = through(STAGE.ball);

      root.scale.setScalar(Math.min(1, viewportWidth / ORB_FIT_SIZE, viewportHeight / ORB_FIT_SIZE));
      float.position.y = Math.sin(time * FLOAT.perSecond) * FLOAT.height;

      tumbleEuler.set(
        TUMBLE.tiltBase +
          eased * TUMBLE.tiltPerStage +
          Math.sin(time * TUMBLE.tiltWobblePerSecond) * TUMBLE.tiltWobbleAngle,
        eased * TUMBLE.turnPerStage + time * TUMBLE.turnPerSecond,
        Math.sin(time * TUMBLE.rollWobblePerSecond) * TUMBLE.rollWobbleAngle,
      );
      faceEuler.set(
        FACE.tilt + Math.sin(time * FACE.nodPerSecond) * FACE.nodAngle,
        Math.sin(time * FACE.swayPerSecond) * FACE.swayAngle,
        0,
      );
      tumble.setFromEuler(tumbleEuler);
      face.setFromEuler(faceEuler);
      spin.quaternion.slerpQuaternions(tumble, face, at(TRACKS.facing));

      // O vidro some quando a bola 8 fecha: nessa hora ele é só uma película
      // limpa colada na laca, então tirar não se nota.
      const glassScale = at(TRACKS.glassScale);
      glassMesh.visible = eased < STAGE.ball;
      glassMesh.scale.set(glassScale, glassScale, glassScale * at(TRACKS.glassFlatten));
      const film = at(TRACKS.glassFilm);
      glass.setLook({
        tint: at(TRACKS.glassTint),
        film,
        thickness: at(TRACKS.glassThickness),
        rim: at(TRACKS.glassRim),
        wear: at(TRACKS.glassWear),
        time,
      });
      // Quanto mais película, mais o giro da esfera é desfeito: as faixas de
      // cor da bolha ficam de frente para a câmera, só balançando.
      wobbleEuler.set(
        Math.sin(time * FILM_WOBBLE.tiltPerSecond) * FILM_WOBBLE.tiltAngle,
        Math.sin(time * FILM_WOBBLE.turnPerSecond) * FILM_WOBBLE.turnAngle,
        0,
      );
      unspin.copy(spin.quaternion).invert().multiply(upright.setFromEuler(wobbleEuler));
      glassMesh.quaternion.identity().slerp(unspin, film);

      const swirlOpacity = at(TRACKS.swirlOpacity);
      const swirlScale = at(TRACKS.swirlScale);
      const isSwirlVisible = swirlOpacity > HIDDEN_BELOW;
      swirl.core.visible = isSwirlVisible;
      air.mesh.visible = isSwirlVisible;
      swirl.core.scale.setScalar(swirlScale);
      air.mesh.scale.setScalar(swirlScale);
      swirl.setOpacity(swirlOpacity);

      const compassScale = at(TRACKS.compassScale);
      compass.group.visible = compassScale > HIDDEN_BELOW && eased < STAGE.ball;
      compass.group.scale.setScalar(compassScale);
      compass.needle.rotation.z =
        Math.sin(time * NEEDLE.swingPerSecond) * NEEDLE.swingAngle + (eased - STAGE.compass) * NEEDLE.turnPerStage;

      const ballScale = at(TRACKS.ballScale);
      const ballOpacity = 1 - smoothstep(TO_TENNIS.dissolveStart, TO_TENNIS.dissolveEnd, toTennis);
      ball.mesh.visible = eased > STAGE.compass && ballOpacity > HIDDEN_BELOW;
      ball.mesh.scale.set(ballScale, ballScale, ballScale * at(TRACKS.ballFlatten));
      ball.material.opacity = ballOpacity;

      tennis.group.visible = eased > STAGE.ball;
      tennis.group.scale.setScalar(lerp(TO_TENNIS.hiddenScale, 1, toTennis));
      tennis.setFuzz(smoothstep(0, TO_TENNIS.fuzzEnd, toTennis));

      shadowOpacity = at(TRACKS.shadowOpacity);
    },

    /**
     * Deixa tudo pronto na placa de vídeo antes de ser preciso: compila os
     * materiais (como aparecem na tela e como aparecem através do vidro) e
     * envia as texturas. Sem isso, cada objeto engasga na primeira vez que
     * aparece, bem no meio da rolagem.
     */
    warmUp(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
      renderer.compile(scene, camera);
      // Dentro do vidro os objetos são desenhados numa imagem à parte, e isso pede outra variante de cada material.
      const insideGlass = new WebGLRenderTarget(1, 1);
      renderer.setRenderTarget(insideGlass);
      renderer.compile(scene, camera);
      renderer.setRenderTarget(null);
      insideGlass.dispose();

      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        for (const material of [object.material].flat() as Material[]) {
          for (const value of Object.values(material)) {
            if (value instanceof Texture) renderer.initTexture(value);
          }
        }
      });
    },

    /** Liga o estúdio de reflexos em todos os materiais que reagem à luz. */
    setEnvironment(texture: Texture | null) {
      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        for (const material of [object.material].flat() as Material[]) {
          if (!(material instanceof MeshStandardMaterial)) continue;
          material.envMap = texture;
          material.needsUpdate = true;
        }
      });
    },

    dispose() {
      const geometries = new Set<BufferGeometry>();
      const materials = new Set<Material>();
      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        geometries.add(object.geometry as BufferGeometry);
        for (const material of [object.material].flat() as Material[]) materials.add(material);
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) {
        if ("map" in material && material.map instanceof Texture) material.map.dispose();
        material.dispose();
      }
      glass.dispose();
      compass.dispose();
      tennis.dispose();
      scuffs.dispose();
    },
  };
}

export type Orb = ReturnType<typeof createOrb>;
