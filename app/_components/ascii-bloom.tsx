"use client";

import { useEffect, useRef } from "react";

import { useIsDarkTheme } from "@/components/theme-toggle";
import { startAsciiBloom, type BloomFlower, type BloomPage } from "@/lib/ascii-bloom";

type AsciiBloomProps = {
  /** Qual flor desenhar (cada uma tem recorte e cores medidos para o próprio vídeo). */
  flower: BloomFlower;
  /** URL do vídeo da flor (em `public/`). */
  src: string;
  /** Fundo da página atrás do canvas. Sem valor, segue o tema claro/escuro do site. */
  page?: BloomPage;
  className?: string;
};

/**
 * Enfeite do herói e do painel de marca: flor desabrochando desenhada com
 * caracteres coloridos. Decorativa (aria-hidden); quem pede menos movimento vê
 * a flor já aberta.
 */
export function AsciiBloom({ flower, src, page, className }: AsciiBloomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkTheme();
  const resolvedPage: BloomPage = page ?? (isDark ? "dark" : "light");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAsciiBloom(canvas, { flower, src, page: resolvedPage });
  }, [flower, src, resolvedPage]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
