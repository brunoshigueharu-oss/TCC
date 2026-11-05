"use client";

import { useCallback, type PointerEvent } from "react";

/**
 * Publica a posição do ponteiro dentro do elemento como as variáveis CSS
 * `--pointer-x` e `--pointer-y`, em px a partir do centro (de `-maxOffset` a
 * `maxOffset`). Ao sair, volta para o centro. As classes Tailwind leem essas
 * variáveis, então o componente não precisa de estado nem re-render.
 */
export function usePointerOffset<T extends HTMLElement>(maxOffset: number) {
  const handlePointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      element.style.setProperty("--pointer-x", `${normalizedX * maxOffset}px`);
      element.style.setProperty("--pointer-y", `${normalizedY * maxOffset}px`);
    },
    [maxOffset],
  );

  const handlePointerLeave = useCallback((event: PointerEvent<T>) => {
    event.currentTarget.style.setProperty("--pointer-x", "0px");
    event.currentTarget.style.setProperty("--pointer-y", "0px");
  }, []);

  return { onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave };
}
