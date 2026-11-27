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
  /**
   * Deixa as letras empurradas pelo mouse passarem da borda sem corte: o canvas
   * sobra `BLEED.px` em cada lado da área e o mouse é lido na janela toda.
   */
  hasBleed?: boolean;
};

/**
 * Margem do canvas em volta da flor (px) e a classe de cada modo. O Tailwind só
 * enxerga nomes completos de classe, então `-inset-20` e o `size` ficam literais
 * aqui e precisam bater com `px` (-inset-20 = 80px; size = 100% + 2 x 80px).
 */
const BLEED = {
  px: 80,
  withBleed: "pointer-events-none absolute -inset-20 size-[calc(100%+160px)]",
  withoutBleed: "block size-full",
} as const;

/**
 * Enfeite do herói e do painel de marca: flor desabrochando desenhada com
 * caracteres coloridos. Decorativa (aria-hidden); quem pede menos movimento vê
 * a flor já aberta.
 */
export function AsciiBloom({ flower, src, page, className, hasBleed = false }: AsciiBloomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDarkTheme();
  const resolvedPage: BloomPage = page ?? (isDark ? "dark" : "light");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAsciiBloom(canvas, { flower, src, page: resolvedPage, bleed: hasBleed ? BLEED.px : 0 });
  }, [flower, src, resolvedPage, hasBleed]);

  return (
    <div aria-hidden className={className}>
      <canvas ref={canvasRef} className={hasBleed ? BLEED.withBleed : BLEED.withoutBleed} />
    </div>
  );
}
