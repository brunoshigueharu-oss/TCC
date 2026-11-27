"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, N8AO, wrapEffect } from "@react-three/postprocessing";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";

import { useIsDarkTheme } from "@/components/theme-toggle";
import { createOrb, ORB_FLOOR_HEIGHT } from "@/lib/orb/create-orb";
import { PageToneMappingEffect } from "@/lib/orb/orb-tone-mapping";
import { createOrbEnvironment } from "@/lib/three-materials/environment";
import { readOrbPalette } from "@/lib/three-materials/palette";

type OrbCanvasProps = {
  /** Progresso da rolagem, de 0 (bolinha de gude) a 4 (bola de tênis). */
  progressRef: RefObject<number>;
  /** `false` para quem pede menos movimento: o objeto só responde à rolagem. */
  isAnimated: boolean;
};

const CAMERA_DISTANCE = 9;
const CAMERA_FIELD_OF_VIEW = 28;
/** Só o que está perto do objeto entra na conta de profundidade (foco e oclusão ficam mais precisos). */
const CAMERA_RANGE = { near: 1, far: 40 } as const;
/** Quanto maior, mais rápido o objeto alcança a rolagem (suaviza trancos). */
const SCROLL_FOLLOW_SPEED = 7;
const KEY_LIGHT_POSITION = [-5, 2.5, 4.5] as const;
/**
 * O antisserrilhado e a curva de exposição saem do renderizador e passam para
 * a "revelação" (o `EffectComposer` abaixo), que trabalha a imagem inteira.
 */
const RENDERER_OPTIONS = { antialias: false, alpha: false, powerPreference: "high-performance" } as const;

/**
 * "Lente e filme": o que uma câmera de verdade acrescenta à imagem e que, por
 * faltar, entrega que é render.
 */
const LENS = {
  multisampling: 4,
  /** Sombra nos encaixes e reentrâncias (aro da bússola, raiz do feltro). */
  occlusion: { radius: 0.55, intensity: 2.2, falloff: 1 },
  /** Foco no objeto inteiro; o que está atrás dele (a sombra no chão) sai levemente macio, como em macro. */
  focus: { distance: CAMERA_DISTANCE - 0.3, range: 3, bokeh: 1.4 },
  /** Só o que estoura (reflexo dos painéis de luz) ganha halo. */
  bloom: { threshold: 1.15, smoothing: 0.25, intensity: 0.4 },
  grain: 0.05,
} as const;

/** Sombra de contato: o objeto visto de baixo, borrado, no "chão". */
const SHADOW = { size: 7, reach: 3.4, blur: 2.6, resolution: 512 } as const;

/** Ordem no quadro: o objeto é atualizado antes de a sombra de contato ser desenhada. */
const BEFORE_SHADOW = -1;

const PageToneMapping = wrapEffect(PageToneMappingEffect);

/**
 * A sombra de contato é desenhada numa imagem à parte, que precisa começar
 * transparente. Num canvas opaco o padrão é começar preta, e o "chão" inteiro
 * apareceria como um retângulo cinza.
 */
function handleCreated({ gl }: RootState) {
  gl.setClearAlpha(0);
}

function OrbScene({ progressRef, isAnimated }: OrbCanvasProps) {
  const renderer = useThree((state) => state.gl);
  const [palette] = useState(readOrbPalette);
  const [orb] = useState(() => createOrb(palette));
  const shadowRef = useRef<Group>(null);
  const timeRef = useRef(0);
  // Começa vazio para o objeto já nascer no ponto da rolagem, sem "correr" até lá.
  const followedProgressRef = useRef<number | null>(null);

  useEffect(() => {
    const environment = createOrbEnvironment(renderer, palette);
    orb.setEnvironment(environment.texture);
    return () => {
      orb.setEnvironment(null);
      environment.dispose();
    };
  }, [orb, palette, renderer]);

  useEffect(() => () => orb.dispose(), [orb]);

  useFrame((state, delta) => {
    // A "revelação" desliga a limpeza automática da imagem; a sombra de
    // contato depende dela para não acumular os quadros anteriores.
    state.gl.autoClear = true;
    if (isAnimated) timeRef.current += delta;
    const follow = 1 - Math.exp(-delta * SCROLL_FOLLOW_SPEED);
    const target = progressRef.current;
    const followed = followedProgressRef.current ?? target;
    const progress = followed + (target - followed) * follow;
    followedProgressRef.current = progress;
    orb.update({
      progress,
      time: timeRef.current,
      viewportWidth: state.viewport.width,
      viewportHeight: state.viewport.height,
    });
    // O primeiro filho do grupo da sombra é o plano em que ela é pintada.
    const shadowPlane = shadowRef.current?.children[0] as Mesh<never, MeshBasicMaterial> | undefined;
    if (shadowPlane) shadowPlane.material.opacity = orb.shadowOpacity;
  }, BEFORE_SHADOW);

  return (
    <>
      {/*
        Fundo pintado na cor da página (e não transparente): é ele que o vidro
        refrata. Com canvas transparente o vidro só soma brilho e some no branco.
      */}
      <color attach="background" args={[palette.fundo]} />
      {/* Luz vinda da esquerda: o brilho dela cai fora do círculo do 8 e não apaga o número. */}
      <directionalLight position={KEY_LIGHT_POSITION} intensity={1.6} />
      <primitive object={orb.root}>
        <ContactShadows
          ref={shadowRef}
          position={[0, ORB_FLOOR_HEIGHT, 0]}
          scale={SHADOW.size}
          far={SHADOW.reach}
          blur={SHADOW.blur}
          resolution={SHADOW.resolution}
        />
      </primitive>
      <EffectComposer multisampling={LENS.multisampling}>
        <N8AO
          aoRadius={LENS.occlusion.radius}
          intensity={LENS.occlusion.intensity}
          distanceFalloff={LENS.occlusion.falloff}
          quality="medium"
        />
        <DepthOfField
          worldFocusDistance={LENS.focus.distance}
          worldFocusRange={LENS.focus.range}
          bokehScale={LENS.focus.bokeh}
        />
        <Bloom
          mipmapBlur
          luminanceThreshold={LENS.bloom.threshold}
          luminanceSmoothing={LENS.bloom.smoothing}
          intensity={LENS.bloom.intensity}
        />
        <PageToneMapping grain={LENS.grain} />
      </EffectComposer>
    </>
  );
}

/**
 * Canvas do render 3D. Decorativo (aria-hidden): quem lê a página com leitor
 * de tela recebe os nomes dos objetos pela legenda.
 */
export function OrbCanvas(props: OrbCanvasProps) {
  const isDark = useIsDarkTheme();

  return (
    <Canvas
      aria-hidden
      dpr={[1, 2]}
      camera={{ fov: CAMERA_FIELD_OF_VIEW, position: [0, 0, CAMERA_DISTANCE], ...CAMERA_RANGE }}
      gl={RENDERER_OPTIONS}
      onCreated={handleCreated}
    >
      {/* As cores vêm dos tokens do tema: ao trocar de tema, o objeto é refeito. */}
      <OrbScene key={isDark ? "escuro" : "claro"} {...props} />
    </Canvas>
  );
}
