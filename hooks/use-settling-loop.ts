"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { createSettlingLoop } from "@/lib/motion";

type SettlingLoop = ReturnType<typeof createSettlingLoop>;

/**
 * `createSettlingLoop` preso a um componente: `step` recebe o tempo desde o
 * quadro anterior e devolve se ainda há movimento. O laço só é criado no
 * primeiro `start` (fora do render) e para sozinho ao desmontar.
 */
export function useSettlingLoop(step: (deltaSeconds: number) => boolean) {
  const stepRef = useRef(step);
  const loopRef = useRef<SettlingLoop | null>(null);

  // Sempre a versão mais recente do passo, sem recriar o laço.
  useLayoutEffect(() => {
    stepRef.current = step;
  });

  const start = useCallback(() => {
    loopRef.current ??= createSettlingLoop((deltaSeconds) => stepRef.current(deltaSeconds));
    loopRef.current.start();
  }, []);

  const stop = useCallback(() => loopRef.current?.stop(), []);

  useEffect(() => stop, [stop]);

  return { start, stop };
}
