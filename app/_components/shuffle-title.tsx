"use client";

import { useMemo } from "react";

import { useGlyphShuffle } from "@/hooks/use-glyph-shuffle";
import { shuffleFontClasses } from "@/lib/fonts-landing";
import { layoutWords } from "@/lib/glyph-variants";
import { ShuffleWords } from "./shuffle-words";

type ShuffleTitleProps = {
  id: string;
  lines: string[];
};

/**
 * Atraso de entrada de cada palavra do título, em ordem. Classes literais
 * porque o Tailwind não enxerga nomes montados em tempo de execução.
 */
const wordDelayClasses = [
  "[animation-delay:100ms]",
  "[animation-delay:220ms]",
  "[animation-delay:340ms]",
  "[animation-delay:460ms]",
  "[animation-delay:580ms]",
  "[animation-delay:700ms]",
  "[animation-delay:820ms]",
  "[animation-delay:940ms]",
];

/** Classe da animação de entrada; desliga para quem pede menos movimento. */
const blurInClasses = "inline-block animate-blur-in motion-reduce:animate-none";

/** Cada palavra sai do desfoque um pouco depois da anterior. */
const wordEntranceClass = (wordIndex: number) =>
  `${blurInClasses} ${wordDelayClasses[Math.min(wordIndex, wordDelayClasses.length - 1)]}`;

/**
 * Título do herói. As letras perto do cursor embaralham entre fontes e formas
 * coloridas — o efeito segue o mouse, atravessando as palavras. Ao carregar,
 * as palavras entram uma a uma saindo do desfoque.
 */
export function ShuffleTitle({ id, lines }: ShuffleTitleProps) {
  const { slots, letterCount } = useMemo(() => layoutWords(lines), [lines]);
  const { glyphs, containerRef, registerLetter } = useGlyphShuffle<HTMLHeadingElement>(letterCount);

  return (
    <h1
      ref={containerRef}
      id={id}
      className={`${shuffleFontClasses} font-display text-[clamp(48px,8.4vw,120px)] leading-[0.96] font-medium tracking-[-0.055em]`}
    >
      <ShuffleWords slots={slots} glyphs={glyphs} registerLetter={registerLetter} wordClassName={wordEntranceClass} />
    </h1>
  );
}
