"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { scheduleWhenIdle } from "@/lib/idle";
import { isLatestIntersecting } from "@/lib/motion";

type DeferredCanvasOptions = {
  /**
   * Distância da tela (margem de `IntersectionObserver`, ex.: "500px") a partir
   * da qual o canvas começa a ser carregado. Sem ela, carrega assim que o
   * navegador ficar à toa, esteja a caixa onde estiver.
   */
  loadMargin?: string;
};

/**
 * Carregamento adiado de um canvas 3D pesado. Devolve:
 *
 *   boxRef       a caixa observada (vai no elemento que envolve o canvas)
 *   isLoaded     hora de montar o canvas (navegador à toa e, com `loadMargin`, caixa por perto)
 *   isInView     a caixa está na tela: fora dela o canvas pode parar de desenhar
 *   isReady      o canvas avisou que já desenha pronto (para o fade de entrada)
 *   handleReady  o aviso que o canvas chama quando fica pronto
 */
export function useDeferredCanvas<T extends HTMLElement = HTMLDivElement>({ loadMargin }: DeferredCanvasOptions = {}) {
  const boxRef = useRef<T>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver((entries) => setIsInView(isLatestIntersecting(entries)));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const handleIdle = () => setIsLoaded(true);
    if (loadMargin === undefined) return scheduleWhenIdle(handleIdle);

    let cancelLoad: (() => void) | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isLatestIntersecting(entries)) return;
        observer.disconnect();
        cancelLoad = scheduleWhenIdle(handleIdle);
      },
      { rootMargin: loadMargin },
    );
    observer.observe(box);
    return () => {
      observer.disconnect();
      cancelLoad?.();
    };
  }, [loadMargin]);

  const handleReady = useCallback(() => setIsReady(true), []);

  return { boxRef, isLoaded, isInView, isReady, handleReady };
}
