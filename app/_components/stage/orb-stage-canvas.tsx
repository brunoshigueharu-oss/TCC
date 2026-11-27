"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Euler, type Group, MathUtils, Quaternion, Vector3 } from "three";

import { useSceneEnvironment } from "@/hooks/use-scene-environment";
import { createIdleQueue } from "@/lib/idle";
import { createOrb } from "@/lib/orb/create-orb";
import { ORB_FIT_SIZE } from "@/lib/orb/orb-timeline";
import { MAX_STEP_SECONDS } from "@/lib/motion";
import { PIXEL_RATIO, RENDERER_OPTIONS } from "@/lib/three/canvas-defaults";
import { GLASS_PROFILES } from "@/lib/three-materials/glass";
import { readOrbPalette } from "@/lib/three-materials/palette";

/** O que a peça pede ao canvas. Quem escreve é `OrbPiece`, a cada evento do ponteiro. */
export type OrbStageControl = {
  /** Objeto que deve aparecer: 0 (bolinha de gude) a 4 (bola de tênis). */
  targetStage: number;
  /** Arrasto ainda não aplicado ao objeto, em px. */
  dragX: number;
  dragY: number;
  isDragging: boolean;
  /** Posição do ponteiro na peça, de -1 a 1: sem arrasto, o objeto se inclina de leve para lá. */
  leanX: number;
  leanY: number;
};

type OrbStageCanvasProps = {
  controlRef: RefObject<OrbStageControl>;
  /** `false` enquanto a peça está fora da tela: o desenho para e não gasta nada. */
  isActive: boolean;
  /** `false` para quem pede menos movimento: sem giro próprio nem transformação gradual. */
  isAnimated: boolean;
  /**
   * O canvas já desenha pronto. Até aqui o relógio da animação fica parado
   * no zero: o primeiro quadro visível tem a mesma pose do pôster estático.
   */
  onReady: () => void;
  /**
   * O objeto na tela mudou: a transformação passou da metade. Na troca
   * automática é o que mantém o nome destacado igual ao objeto visível.
   */
  onStageShown: (stage: number) => void;
};

const CAMERA_DISTANCE = 9;
/** A lente fecha exatamente na cena: o canvas é uma caixa justa em volta do objeto. */
const CAMERA = {
  fov: MathUtils.radToDeg(2 * Math.atan(ORB_FIT_SIZE / 2 / CAMERA_DISTANCE)),
  position: [0, 0, CAMERA_DISTANCE],
  near: 1,
  far: 40,
} as const;
const KEY_LIGHT_POSITION = [-5, 2.5, 4.5] as const;
const RESIZE_OPTIONS = { scroll: false, offsetSize: true } as const;
/** O objeto tem uns 230 px no palco: metade da resolução das texturas sobra. */
const TEXTURE_DETAIL = 0.5;
/** Cor do painel do palco: é o "papel" que o vidro e a bolha refratam. */
const PANEL_TOKEN = ["--hub-superficie", "#f1f2f6"] as const;

/** Velocidade da transformação, em objetos por segundo. */
const MORPH_SPEED = 0.7;
/** Giro por px arrastado, em radianos. */
const RADIANS_PER_PIXEL = 0.011;
/** Quanto do giro mais recente entra na velocidade guardada para a inércia (0 a 1). */
const SPIN_SMOOTHING = 0.35;
/** Freio da inércia depois que a pessoa solta (maior = para mais rápido). */
const SPIN_DAMPING = 2.6;
/** Abaixo desta velocidade (rad/s) o objeto começa a voltar para a pose de repouso. */
const SETTLE_BELOW = 0.6;
/** Rapidez da volta para o repouso. */
const RETURN_SPEED = 3.2;
/** Inclinação máxima (rad) na direção do ponteiro, sem arrasto. */
const LEAN = { turn: 0.32, tilt: 0.22 } as const;

const AXIS_X = new Vector3(1, 0, 0);
const AXIS_Y = new Vector3(0, 1, 0);

function readPanelColor() {
  const [token, fallback] = PANEL_TOKEN;
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || fallback;
}

function OrbStageScene({ controlRef, isAnimated, onReady, onStageShown }: Omit<OrbStageCanvasProps, "isActive">) {
  const [palette] = useState(() => ({ ...readOrbPalette(), fundo: readPanelColor() }));
  // Pintar as texturas é a parte cara: vai aos poucos, uma por vez, com o navegador à toa.
  const [backlog] = useState(createIdleQueue);
  const [orb] = useState(() =>
    createOrb(palette, { glassProfile: GLASS_PROFILES.page, textures: { detail: TEXTURE_DETAIL, schedule: backlog.schedule } }),
  );
  /** Giro dado pela pessoa, por cima do giro próprio do objeto. */
  const [turned] = useState(() => new Quaternion());
  const [scratch] = useState(() => ({ step: new Quaternion(), rest: new Quaternion(), euler: new Euler() }));
  const groupRef = useRef<Group>(null);
  /**
   * `progress` começa vazio: o primeiro quadro já nasce no objeto pedido, sem
   * transformação de entrada. `shownStage` é o objeto que está na tela (o
   * inteiro mais perto de `progress`), para avisar quando ele muda.
   */
  const motionRef = useRef<{
    progress: number | null;
    shownStage: number | null;
    time: number;
    spinX: number;
    spinY: number;
  }>({
    progress: null,
    shownStage: null,
    time: 0,
    spinX: 0,
    spinY: 0,
  });
  /** O relógio só anda depois do `onReady` (ver a prop). */
  const isReadyRef = useRef(false);

  useSceneEnvironment(palette, orb, ({ renderer, scene, camera }) => {
    // Por último na fila, com todas as texturas pintadas: qualquer objeto pode ser pedido a
    // qualquer hora, então a peça só aparece (`onReady`) completa e já pronta na placa de vídeo.
    let isCurrent = true;
    backlog.schedule(() => {
      if (!isCurrent) return;
      orb.warmUp(renderer, scene, camera);
      isReadyRef.current = true;
      onReady();
    });
    return () => {
      isCurrent = false;
    };
  });

  // Fora da cena, a fila para de pintar (e retoma se a cena voltar, como no modo estrito do React).
  useEffect(() => {
    backlog.resume();
    return backlog.pause;
  }, [backlog]);

  useEffect(() => () => orb.dispose(), [orb]);

  useFrame((state, delta) => {
    const control = controlRef.current;
    const motion = motionRef.current;
    const step = Math.min(delta, MAX_STEP_SECONDS);
    if (isAnimated && isReadyRef.current) motion.time += step;

    const shown = motion.progress ?? control.targetStage;
    const remaining = control.targetStage - shown;
    // Para um objeto distante a transformação acelera no começo e chega no ritmo normal.
    const pace = MORPH_SPEED * Math.max(1, Math.abs(remaining)) * step;
    const progress = isAnimated ? shown + MathUtils.clamp(remaining, -pace, pace) : control.targetStage;
    motion.progress = progress;

    const shownStage = Math.round(progress);
    if (shownStage !== motion.shownStage) {
      motion.shownStage = shownStage;
      onStageShown(shownStage);
    }

    /** Gira em torno dos eixos da tela (e não dos do objeto): é o que dá a sensação de bola na mão. */
    const turn = (aroundX: number, aroundY: number) => {
      turned.premultiply(scratch.step.setFromAxisAngle(AXIS_Y, aroundY));
      turned.premultiply(scratch.step.setFromAxisAngle(AXIS_X, aroundX));
    };

    if (control.isDragging) {
      const aroundY = control.dragX * RADIANS_PER_PIXEL;
      const aroundX = control.dragY * RADIANS_PER_PIXEL;
      control.dragX = 0;
      control.dragY = 0;
      turn(aroundX, aroundY);
      if (step > 0) {
        motion.spinX = MathUtils.lerp(motion.spinX, aroundX / step, SPIN_SMOOTHING);
        motion.spinY = MathUtils.lerp(motion.spinY, aroundY / step, SPIN_SMOOTHING);
      }
    } else {
      // Solto: segue girando com a inércia e, quando ela acaba, volta para o repouso.
      turn(motion.spinX * step, motion.spinY * step);
      const slowdown = Math.exp(-SPIN_DAMPING * step);
      motion.spinX *= slowdown;
      motion.spinY *= slowdown;
      if (Math.hypot(motion.spinX, motion.spinY) < SETTLE_BELOW) {
        scratch.rest.setFromEuler(scratch.euler.set(control.leanY * LEAN.tilt, control.leanX * LEAN.turn, 0));
        turned.slerp(scratch.rest, isAnimated ? 1 - Math.exp(-RETURN_SPEED * step) : 1);
      }
    }
    groupRef.current?.quaternion.copy(turned);

    orb.update({
      progress,
      time: motion.time,
      viewportWidth: state.viewport.width,
      viewportHeight: state.viewport.height,
    });
  });

  return (
    <>
      <directionalLight position={KEY_LIGHT_POSITION} intensity={1.6} />
      <group ref={groupRef}>
        <primitive object={orb.root} />
      </group>
    </>
  );
}

/**
 * Canvas da peça 3D do palco: os cinco objetos de `lib/orb`, que viram um no
 * outro quando `targetStage` muda e giram com o arrasto. Decorativo: fica
 * fora da leitura de tela (a peça descreve o objeto em texto).
 */
export function OrbStageCanvas({ isActive, ...scene }: OrbStageCanvasProps) {
  return (
    <Canvas
      aria-hidden
      dpr={PIXEL_RATIO}
      frameloop={isActive ? "always" : "never"}
      camera={CAMERA}
      gl={RENDERER_OPTIONS}
      resize={RESIZE_OPTIONS}
    >
      <OrbStageScene {...scene} />
    </Canvas>
  );
}
