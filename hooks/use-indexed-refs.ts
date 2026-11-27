"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Lista de elementos ligados por índice (`refFor(i)` em cada item). O callback
 * de cada índice é criado uma vez só e reaproveitado: um callback novo a cada
 * render faria o React soltar e religar o elemento (`null` e depois o
 * elemento), o que zera qualquer estado guardado por ele no meio de uma
 * animação.
 *
 * `onAttach` roda quando um elemento entra ou sai (`null`) do índice.
 */
export function useIndexedRefs<E extends HTMLElement>(onAttach?: (index: number, element: E | null) => void) {
  const elementsRef = useRef<(E | null)[]>([]);
  const callbacksRef = useRef(new Map<number, (element: E | null) => void>());
  const onAttachRef = useRef(onAttach);
  // Sempre a versão mais recente do callback, sem recriar os refs.
  useLayoutEffect(() => {
    onAttachRef.current = onAttach;
  });

  const refFor = useCallback((index: number) => {
    const cached = callbacksRef.current.get(index);
    if (cached) return cached;
    const callback = (element: E | null) => {
      elementsRef.current[index] = element;
      onAttachRef.current?.(index, element);
    };
    callbacksRef.current.set(index, callback);
    return callback;
  }, []);

  return { elementsRef, refFor };
}
