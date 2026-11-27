"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { clamp } from "@/lib/math";
import { easeOutQuart } from "@/lib/motion";

/** Tamanho do recorte do rascunho e do vetor (os dois no mesmo sistema de coordenadas). */
const ARTWORK = { width: 1720, height: 460 } as const;
/** Posição do divisor, em % da largura: à esquerda fica o rascunho, à direita o vetor. */
const SPLIT = { start: 100, rest: 42, keyStep: 4, min: 0, max: 100 } as const;
/** Apresentação: o divisor corre de `start` até `rest`, revelando o vetor. */
const REVEAL = { delayMs: 350, durationMs: 1300 } as const;

const clampSplit = (value: number) => clamp(value, SPLIT.min, SPLIT.max);

/** Teclas do divisor (padrão de slider): setas andam um passo, Home e End vão às pontas. */
const keySplits: Partial<Record<string, (current: number) => number>> = {
  ArrowLeft: (current) => clampSplit(current - SPLIT.keyStep),
  ArrowRight: (current) => clampSplit(current + SPLIT.keyStep),
  Home: () => SPLIT.min,
  End: () => SPLIT.max,
};

/**
 * Peça do palco: o lettering BASE8 antes e depois da vetorização. O rascunho
 * a lápis fica por cima, recortado até o divisor; arrastar (ou usar as setas
 * do teclado no botão) mostra mais de um ou do outro. Ao aparecer, o divisor
 * corre sozinho uma vez para revelar o vetor.
 */
export function TracePiece() {
  const isReducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  /** Quadro da apresentação em andamento, para a pessoa poder interrompê-la. */
  const revealFrameRef = useRef(0);
  const [split, setSplit] = useState<number>(SPLIT.rest);

  // A posição vai numa variável CSS: as classes do recorte, da linha e do botão leem daí.
  useLayoutEffect(() => {
    frameRef.current?.style.setProperty("--split", `${split}%`);
  }, [split]);

  useEffect(() => {
    if (isReducedMotion) return;
    const startsAt = performance.now() + REVEAL.delayMs;
    const step = (now: number) => {
      const progress = clamp((now - startsAt) / REVEAL.durationMs, 0, 1);
      setSplit(SPLIT.start + (SPLIT.rest - SPLIT.start) * easeOutQuart(progress));
      revealFrameRef.current = progress < 1 ? requestAnimationFrame(step) : 0;
    };
    revealFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(revealFrameRef.current);
  }, [isReducedMotion]);

  /** Quem mexe no divisor assume o controle: a apresentação para onde estiver. */
  const stopReveal = () => {
    cancelAnimationFrame(revealFrameRef.current);
    revealFrameRef.current = 0;
  };

  const moveTo = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setSplit(clampSplit(((clientX - rect.left) / rect.width) * 100));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    stopReveal();
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) moveTo(event.clientX);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = keySplits[event.key]?.(split);
    if (next === undefined) return;
    // Sem isto, Home e End também rolariam a página até o topo ou o fim.
    event.preventDefault();
    stopReveal();
    setSplit(next);
  };

  return (
    <div className="w-full max-w-[860px] px-2 sm:px-6">
      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative aspect-[1720/460] w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-xl border border-linha bg-papel select-none"
      >
        <Image
          src="/landing/pecas/lettering-vetor.svg"
          alt="Lettering BASE8 em vetor, na versão final: cada letra montada com objetos coloridos"
          width={ARTWORK.width}
          height={ARTWORK.height}
          draggable={false}
          className="absolute inset-0 size-full"
        />
        <Image
          src="/landing/pecas/lettering-rascunho.jpg"
          alt="O mesmo lettering no rascunho a lápis"
          width={ARTWORK.width}
          height={ARTWORK.height}
          sizes="(min-width: 900px) 812px, 92vw"
          draggable={false}
          className="absolute inset-0 size-full [clip-path:inset(0_calc(100%_-_var(--split,42%))_0_0)]"
        />
        <span aria-hidden className="absolute inset-y-0 left-[var(--split,42%)] w-px bg-tinta" />
        <button
          type="button"
          role="slider"
          aria-label="Divisor entre o rascunho e o vetor"
          aria-valuemin={SPLIT.min}
          aria-valuemax={SPLIT.max}
          aria-valuenow={Math.round(split)}
          aria-valuetext={`${Math.round(split)}% rascunho`}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 left-[var(--split,42%)] flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-tinta text-papel outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-tinta focus-visible:ring-offset-2 focus-visible:ring-offset-papel"
        >
          <ChevronsLeftRight aria-hidden className="size-4" strokeWidth={2} />
        </button>
      </div>
      <div aria-hidden className="mt-3 flex justify-between text-xs font-medium text-texto-secundario">
        <span>Rascunho</span>
        <span>Vetor</span>
      </div>
    </div>
  );
}
