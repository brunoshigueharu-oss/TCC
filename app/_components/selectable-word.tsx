import type { ReactNode } from "react";

import type { GlyphState, GlyphVariant } from "@/hooks/use-glyph-shuffle";

type SelectableWordProps = {
  word: string;
  /** Estado de cada letra desta palavra (mesma ordem de `word`). */
  glyphs: GlyphState[];
  /** Liga a letra `index` desta palavra ao campo do cursor. */
  registerLetter: (index: number) => (element: HTMLElement | null) => void;
};

/** Fontes da troca (classes literais; o índice vem de `useGlyphShuffle`). */
const fontVariantClasses = [
  "font-shuffle-serif italic font-normal",
  "font-shuffle-mono font-bold",
  "font-shuffle-pixel font-semibold",
  // Unbounded é bem larga: reduz para não invadir as letras vizinhas.
  "font-shuffle-wide font-bold scale-[0.8]",
  "font-display italic font-bold",
];

/** Cores das formas, da paleta do hub. */
const shapeColorClasses = ["fill-acao", "fill-pratica", "fill-comunidade", "fill-trilha"];

/** Formas Bauhaus em viewBox 0 0 10 10: círculo, quadrado, triângulo, meio-círculo, cruz. */
const shapePaths: ReactNode[] = [
  <circle key="circulo" cx="5" cy="5" r="5" />,
  <rect key="quadrado" x="0.5" y="0.5" width="9" height="9" />,
  <path key="triangulo" d="M5 0 L10 10 L0 10 Z" />,
  <path key="meio" d="M0 9 A5 5 0 0 1 10 9 Z" />,
  <path key="cruz" d="M3.5 0 H6.5 V3.5 H10 V6.5 H6.5 V10 H3.5 V6.5 H0 V3.5 H3.5 Z" />,
];

/** Variação desenhada por cima da letra original (que segura a largura). */
function GlyphOverlay({ letter, variant }: { letter: string; variant: GlyphVariant }) {
  if (variant.kind === "shape") {
    return (
      <svg
        viewBox="0 0 10 10"
        className={`absolute top-[54%] left-1/2 size-[0.5em] -translate-x-1/2 -translate-y-1/2 ${shapeColorClasses[variant.color]}`}
      >
        {shapePaths[variant.shape]}
      </svg>
    );
  }
  return (
    <span className={`absolute top-0 left-1/2 -translate-x-1/2 ${fontVariantClasses[variant.font]}`}>
      {letter}
    </span>
  );
}

/**
 * Palavra do título com as letras trocáveis. Só desenha: quem decide qual
 * letra troca é o campo do cursor em `ShuffleTitle`.
 */
export function SelectableWord({ word, glyphs, registerLetter }: SelectableWordProps) {
  const letters = Array.from(word);

  return (
    <span className="relative inline-block">
      {letters.map((letter, index) => {
        const variant = glyphs[index];
        return (
          <span key={index} ref={registerLetter(index)} className="relative inline-block">
            {/* A letra original fica (transparente) para a palavra não mudar de largura. */}
            <span className={variant ? "opacity-0" : undefined}>{letter}</span>
            {variant && (
              <span aria-hidden>
                <GlyphOverlay letter={letter} variant={variant} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
