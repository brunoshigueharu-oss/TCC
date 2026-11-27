"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { MathUtils, type Group, type PerspectiveCamera } from "three";

import { useSceneEnvironment } from "@/hooks/use-scene-environment";
import { createBase8Letters } from "@/lib/letters/letter-geometry";
import {
  createLetterMaterials,
  createLetterObject,
  LETTER_MATERIAL_IDS,
  type LetterMaterialId,
} from "@/lib/letters/letter-materials";
import { easeInOutCubic, MAX_STEP_SECONDS } from "@/lib/motion";
import { PIXEL_RATIO, RENDERER_OPTIONS } from "@/lib/three/canvas-defaults";
import { readOrbPalette } from "@/lib/three-materials/palette";
import { FULL_TEXTURES } from "@/lib/three-materials/textures";

/** Posição do ponteiro sobre as letras, de -1 a 1 (0 = fora ou no centro). Quem escreve é `Base8Letters`. */
export type Base8Pointer = { x: number; y: number };

type Base8CanvasProps = {
  pointerRef: RefObject<Base8Pointer>;
  /** `false` para quem pede menos movimento: a letra troca de material sem girar e a palavra não se inclina. */
  isAnimated: boolean;
  /**
   * O canvas já desenha pronto. Entrega o pedido de redesenho: o canvas só
   * desenha sob demanda, então quem mexe em `pointerRef` chama `invalidate`
   * para a palavra acompanhar o ponteiro. Vem daqui, e não de um import do
   * react-three-fiber, para o 3D não entrar no bundle de quem usa o canvas.
   */
  onReady: (invalidate: () => void) => void;
};

/** Do que cada letra começa feita (B, A, S, E, 8). */
const START_MATERIALS: readonly LetterMaterialId[] = ["latao", "vidro", "cromo", "feltro", "resina"];

const CAMERA = { fov: 20, near: 0.5, far: 60, position: [0, 0, 12] } as const;
/** Quanto da largura e da altura do canvas a palavra ocupa. */
const FIT = { width: 0.9, height: 0.62 } as const;
const KEY_LIGHT_POSITION = [-4, 3.5, 6] as const;
/** As letras medem pouco na tela: metade da resolução das texturas sobra. */
const TEXTURES = { ...FULL_TEXTURES, detail: 0.5 };

/** Pose da palavra: vista um pouco de cima e de lado, para a espessura aparecer. */
const POSE = { x: 0.13, y: -0.2 } as const;
/** Quanto a palavra se inclina na direção do ponteiro (rad) e a rapidez com que acompanha. */
const TILT = { x: 0.1, y: 0.22, speed: 6, settledBelow: 0.0005 } as const;
/** Troca de material: a letra dá uma volta e, de lado para a câmera, passa a ser de outra coisa. */
const SPIN = { seconds: 0.75, turn: Math.PI * 2, swapAt: Math.PI / 2 } as const;
/** Com o mouse parado em cima, a letra espera este tempo (s) entre uma troca e a seguinte. */
const HOLD_SECONDS = 0.85;
/** Área que conta como "em cima da letra": a caixa dela, com folga, inclusive os furos. */
const HIT = { extraWidth: 0.04, height: 1.14 } as const;

type LetterState = {
  material: number;
  /** Tempo de giro já percorrido (s) e se o material já trocou nesta volta; `null` = parada. */
  spin: { elapsed: number; hasSwapped: boolean } | null;
  isHovered: boolean;
  /** Quanto falta (s) para a próxima troca enquanto o mouse segue em cima. */
  holdLeft: number;
};

function Base8Scene({ pointerRef, isAnimated, onReady }: Base8CanvasProps) {
  const invalidate = useThree((state) => state.invalidate);
  const [palette] = useState(readOrbPalette);
  const [word] = useState(createBase8Letters);
  const [materials] = useState(() => createLetterMaterials(palette, TEXTURES));
  const [objects] = useState(() =>
    word.letters.map((letter, index) => {
      const object = createLetterObject(letter, materials);
      object.setMaterial(START_MATERIALS[index % START_MATERIALS.length]);
      return object;
    }),
  );
  const wordRef = useRef<Group>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const statesRef = useRef<LetterState[]>(
    word.letters.map((_, index) => ({
      material: LETTER_MATERIAL_IDS.indexOf(START_MATERIALS[index % START_MATERIALS.length]),
      spin: null,
      isHovered: false,
      holdLeft: 0,
    })),
  );

  useSceneEnvironment(palette, materials, ({ renderer, scene, camera }) => {
    renderer.compile(scene, camera);
    onReady(() => invalidate());
    invalidate();
  });

  useEffect(
    () => () => {
      materials.dispose();
      word.dispose();
    },
    [materials, word],
  );

  /** Passa a letra para o material seguinte da lista. */
  const swapMaterial = (index: number) => {
    const state = statesRef.current[index];
    state.material = (state.material + 1) % LETTER_MATERIAL_IDS.length;
    objects[index].setMaterial(LETTER_MATERIAL_IDS[state.material]);
  };

  /** Começa uma troca: com giro, ou na hora para quem pede menos movimento. */
  const startSwap = (index: number) => {
    const state = statesRef.current[index];
    if (state.spin) return;
    if (isAnimated) state.spin = { elapsed: 0, hasSwapped: false };
    else swapMaterial(index);
    invalidate();
  };

  const handlePointerOver = (index: number) => (event: ThreeEvent<PointerEvent>) => {
    if (event.pointerType !== "mouse") return;
    statesRef.current[index].isHovered = true;
    startSwap(index);
  };

  const handlePointerOut = (index: number) => () => {
    statesRef.current[index].isHovered = false;
  };

  /** No toque não há "mouse em cima": cada toque é uma troca. */
  const handlePointerDown = (index: number) => (event: ThreeEvent<PointerEvent>) => {
    if (event.pointerType !== "mouse") startSwap(index);
  };

  useFrame((state, delta) => {
    const step = Math.min(delta, MAX_STEP_SECONDS);
    let isBusy = false;

    // A câmera recua o quanto for preciso para a palavra caber no canvas.
    const view = state.camera as PerspectiveCamera;
    const reach = 2 * Math.tan(MathUtils.degToRad(view.fov / 2));
    view.position.z = Math.max(word.width / FIT.width / (reach * view.aspect), 1 / FIT.height / reach);

    statesRef.current.forEach((letter, index) => {
      const object = objects[index];
      if (letter.spin) {
        isBusy = true;
        letter.spin.elapsed += step;
        const angle = SPIN.turn * easeInOutCubic(Math.min(1, letter.spin.elapsed / SPIN.seconds));
        if (!letter.spin.hasSwapped && angle >= SPIN.swapAt) {
          swapMaterial(index);
          letter.spin.hasSwapped = true;
        }
        object.group.rotation.y = angle;
        if (letter.spin.elapsed >= SPIN.seconds) {
          object.group.rotation.y = 0;
          letter.spin = null;
          letter.holdLeft = HOLD_SECONDS;
        }
        return;
      }
      if (!letter.isHovered || !isAnimated) return;
      // Mouse parado em cima: conta o tempo e troca de novo.
      isBusy = true;
      letter.holdLeft -= step;
      if (letter.holdLeft <= 0) letter.spin = { elapsed: 0, hasSwapped: false };
    });

    const tilt = tiltRef.current;
    const pointer = pointerRef.current;
    const targetX = isAnimated ? -pointer.y * TILT.x : 0;
    const targetY = isAnimated ? pointer.x * TILT.y : 0;
    const follow = 1 - Math.exp(-TILT.speed * step);
    tilt.x += (targetX - tilt.x) * follow;
    tilt.y += (targetY - tilt.y) * follow;
    if (Math.abs(targetX - tilt.x) + Math.abs(targetY - tilt.y) > TILT.settledBelow) isBusy = true;
    wordRef.current?.rotation.set(POSE.x + tilt.x, POSE.y + tilt.y, 0);

    // Só pede outro quadro enquanto algo ainda está se mexendo.
    if (isBusy) state.invalidate();
  });

  return (
    <>
      <directionalLight position={KEY_LIGHT_POSITION} intensity={1.5} />
      <group ref={wordRef}>
        {word.letters.map((letter, index) => (
          <group key={letter.character}>
            <primitive object={objects[index].group} />
            <mesh
              position-x={letter.x}
              onPointerOver={handlePointerOver(index)}
              onPointerOut={handlePointerOut(index)}
              onPointerDown={handlePointerDown(index)}
            >
              <boxGeometry args={[letter.width + HIT.extraWidth, HIT.height, word.depth]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

/**
 * Canvas das letras 3D de BASE8. Cada letra é feita de um material e troca
 * para o seguinte quando o mouse passa por cima (ou a cada toque). Só
 * redesenha enquanto algo se mexe: parado, não gasta nada. Decorativo: o
 * nome da marca fica em texto, fora do canvas.
 */
export function Base8Canvas(props: Base8CanvasProps) {
  return (
    <Canvas aria-hidden dpr={PIXEL_RATIO} frameloop="demand" camera={CAMERA} gl={RENDERER_OPTIONS}>
      <Base8Scene {...props} />
    </Canvas>
  );
}
