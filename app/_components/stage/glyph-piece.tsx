"use client";

import { useEffect, useRef } from "react";

import { startAsciiBetta } from "@/lib/ascii-betta";

/** Vídeo de origem do peixe (o mesmo do painel de marca das telas de entrada). */
const BETTA_VIDEO = "/entrada/betta.mp4";

/**
 * Peça do palco: um peixe betta desenhado com caracteres coloridos, a partir
 * de um vídeo. A cena foi medida para fundo preto, então a peça traz a
 * própria moldura escura. O vídeo só é baixado quando a peça aparece.
 */
export function GlyphPiece() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startAsciiBetta(canvas, { src: BETTA_VIDEO });
  }, []);

  return (
    <div className="relative aspect-[4/3] h-full max-h-[360px] max-w-full overflow-hidden rounded-xl bg-tinta">
      <canvas ref={canvasRef} aria-hidden className="size-full" />
      <p className="sr-only">Peixe betta nadando, desenhado com caracteres coloridos.</p>
    </div>
  );
}
