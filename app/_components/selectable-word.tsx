import {
  GLYPH_COLOR_CLASSES,
  GLYPH_FONT_CLASSES,
  GLYPH_SHAPE_PATHS,
  type GlyphState,
  type GlyphVariant,
} from "@/lib/glyph-variants";

type SelectableWordProps = {
  word: string;
  /** Estado de cada letra desta palavra (mesma ordem de `word`). */
  glyphs: GlyphState[];
  /** Liga a letra `index` desta palavra ao campo do cursor. */
  registerLetter: (index: number) => (element: HTMLElement | null) => void;
};

/** Variação desenhada por cima da letra original (que segura a largura). */
function GlyphOverlay({ letter, variant }: { letter: string; variant: GlyphVariant }) {
  if (variant.kind === "shape") {
    return (
      <svg
        viewBox="0 0 10 10"
        className={`absolute top-[54%] left-1/2 size-[0.5em] -translate-x-1/2 -translate-y-1/2 ${GLYPH_COLOR_CLASSES[variant.color]}`}
      >
        <path d={GLYPH_SHAPE_PATHS[variant.shape]} />
      </svg>
    );
  }
  return (
    <span className={`absolute top-0 left-1/2 -translate-x-1/2 ${GLYPH_FONT_CLASSES[variant.font]}`}>{letter}</span>
  );
}

/**
 * Palavra do título com as letras trocáveis. Só desenha: quem decide qual
 * letra troca é o hook (`useGlyphShuffle` ou `useGlyphWave`).
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
