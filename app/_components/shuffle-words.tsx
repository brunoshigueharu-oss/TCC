import type { GlyphState, WordSlot } from "@/lib/glyph-variants";
import { SelectableWord } from "./selectable-word";

export type ShuffleWordsProps = {
  /** Palavras numeradas por linha (`layoutWords`). */
  slots: WordSlot[][];
  /** Estado de cada letra do texto inteiro (dos hooks de troca). */
  glyphs: GlyphState[];
  /** Liga a letra `i` do texto inteiro ao campo do cursor. */
  registerLetter: (index: number) => (element: HTMLElement | null) => void;
  /** Classe de cada palavra (o título usa para escalonar a entrada). */
  wordClassName?: (wordIndex: number) => string | undefined;
};

/**
 * Desenha um texto de troca de letras: uma linha por bloco quando há mais de
 * uma, palavra por palavra, cada letra ligada ao estado do hook. Serve ao
 * título do herói e aos títulos das seções.
 */
export function ShuffleWords({ slots, glyphs, registerLetter, wordClassName }: ShuffleWordsProps) {
  const isMultiline = slots.length > 1;

  return slots.map((lineSlots, lineIndex) => (
    <span key={lineIndex} className={isMultiline ? "block" : undefined}>
      {/* Espaço entre linhas para o leitor de tela não juntar as palavras. */}
      {lineIndex > 0 && <span className="sr-only"> </span>}
      {lineSlots.map(({ word, wordIndex, letterStart, letterEnd }, index) => (
        <span key={wordIndex}>
          {index > 0 && " "}
          <span className={wordClassName?.(wordIndex)}>
            <SelectableWord
              word={word}
              glyphs={glyphs.slice(letterStart, letterEnd)}
              registerLetter={(letterIndex) => registerLetter(letterStart + letterIndex)}
            />
          </span>
        </span>
      ))}
    </span>
  ));
}
