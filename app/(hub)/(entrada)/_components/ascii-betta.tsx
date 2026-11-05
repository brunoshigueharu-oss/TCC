"use client";

import { useEffect, useRef } from "react";

import { startAsciiBetta } from "@/lib/ascii-betta";

type AsciiBettaProps = {
  /** URL do vídeo do betta (em `public/`). */
  src: string;
  className?: string;
};

/**
 * Enfeite do painel de marca: betta nadando desenhado com caracteres, em fundo preto.
 * Decorativo (aria-hidden); quem pede menos movimento vê o peixe parado.
 */
export function AsciiBetta({ src, className }: AsciiBettaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAsciiBetta(canvas, { src });
  }, [src]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
