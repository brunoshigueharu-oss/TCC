"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useEffectEvent } from "react";
import type { Camera, Scene, Texture, WebGLRenderer } from "three";

import { createOrbEnvironment } from "@/lib/three-materials/environment";
import type { OrbPalette } from "@/lib/three-materials/palette";

/** O que recebe os reflexos do estúdio: o orbe inteiro ou o jogo de materiais das letras. */
type EnvironmentTarget = {
  setEnvironment: (texture: Texture | null) => void;
};

export type SceneParts = {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
};

/**
 * Monta o estúdio de reflexos (`lib/three-materials/environment`) para a cena
 * em que está, liga-o em `target` e desmonta tudo ao sair. Com o estúdio
 * ligado, chama `onEnvironment` (para compilar materiais, avisar que a cena
 * ficou pronta etc.); o que ela devolver roda na desmontagem.
 *
 * Só funciona dentro de um `<Canvas>` do react-three-fiber.
 */
export function useSceneEnvironment(
  palette: OrbPalette,
  target: EnvironmentTarget,
  onEnvironment: (parts: SceneParts) => void | (() => void),
) {
  const renderer = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  // Lê sempre a versão mais recente do callback sem refazer o estúdio a cada render.
  const handleEnvironment = useEffectEvent(onEnvironment);

  useEffect(() => {
    const environment = createOrbEnvironment(renderer, palette);
    target.setEnvironment(environment.texture);
    const cleanup = handleEnvironment({ renderer, scene, camera });
    return () => {
      cleanup?.();
      target.setEnvironment(null);
      environment.dispose();
    };
  }, [camera, palette, renderer, scene, target]);
}
