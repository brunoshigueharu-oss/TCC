"use client";

import { useGlyphShuffle } from "@/hooks/use-glyph-shuffle";
import { shuffleFontClasses } from "@/lib/fonts-landing";
import { SelectableWord } from "./selectable-word";

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

type WordSlot = { word: string; wordIndex: number; letterStart: number };

/** Numera palavras e letras do título inteiro, linha a linha. */
function layoutWords(lines: string[]) {
  let wordIndex = 0;
  let letterStart = 0;
  const slots: WordSlot[][] = lines.map((line) =>
    line.split(" ").filter(Boolean).map((word) => {
      const slot = { word, wordIndex, letterStart };
      wordIndex += 1;
      letterStart += Array.from(word).length;
      return slot;
    }),
  );
  return { slots, letterCount: letterStart };
}

/**
 * Título do herói. As letras perto do cursor embaralham entre fontes e formas
 * coloridas — o efeito segue o mouse, atravessando as palavras. Ao carregar,
 * as palavras entram uma a uma saindo do desfoque.
 */
export function ShuffleTitle({ id, lines }: ShuffleTitleProps) {
  const { slots, letterCount } = layoutWords(lines);
  const { glyphs, containerRef, registerLetter } = useGlyphShuffle<HTMLHeadingElement>(letterCount);

  return (
    <h1
      ref={containerRef}
      id={id}
      className={`${shuffleFontClasses} font-display text-[clamp(48px,8.4vw,120px)] leading-[0.96] font-medium tracking-[-0.055em]`}
    >
      {slots.map((lineSlots, lineIndex) => (
        <span key={lines[lineIndex]} className="block">
          {/* Espaço entre linhas para o leitor de tela não juntar as palavras. */}
          {lineIndex > 0 && <span className="sr-only"> </span>}
          {lineSlots.map(({ word, wordIndex, letterStart }, index) => {
            const delayClass = wordDelayClasses[Math.min(wordIndex, wordDelayClasses.length - 1)];
            const letterEnd = letterStart + Array.from(word).length;
            return (
              <span key={`${word}-${index}`}>
                {index > 0 && " "}
                <span className={`${blurInClasses} ${delayClass}`}>
                  <SelectableWord
                    word={word}
                    glyphs={glyphs.slice(letterStart, letterEnd)}
                    registerLetter={(letterIndex) => registerLetter(letterStart + letterIndex)}
                  />
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
