"use client";

import { useEffect, useRef } from "react";

import { startAsciiGatinho } from "@/lib/ascii-gatinho";

type AsciiGatinhoProps = {
  /** URL do vídeo do gatinho (em `public/`). */
  src: string;
  className?: string;
};

/**
 * Enfeite do painel de marca no passo "Objetivo" do onboarding: gatinho
 * desenhado com caracteres, em fundo preto.
 * Decorativo (aria-hidden); quem pede menos movimento vê o gatinho parado.
 */
export function AsciiGatinho({ src, className }: AsciiGatinhoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAsciiGatinho(canvas, { src });
  }, [src]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
