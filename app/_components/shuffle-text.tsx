"use client";

import { useMemo, type Ref } from "react";

import { useGlyphShuffle } from "@/hooks/use-glyph-shuffle";
import { useGlyphWave } from "@/hooks/use-glyph-wave";
import { shuffleFontClasses } from "@/lib/fonts-landing";
import { layoutWords } from "@/lib/glyph-variants";
import { cn } from "@/lib/utils";
import { ShuffleWords, type ShuffleWordsProps } from "./shuffle-words";

type ShuffleTextProps = {
  text: string;
  /**
   * `pointer`: as letras perto do cursor trocam, como no título do herói.
   * `auto`: uma onda de troca passa pela palavra sozinha, duas vezes a cada entrada na tela.
   */
  trigger?: "pointer" | "auto";
  className?: string;
};

type ShuffleVariantProps = Omit<ShuffleTextProps, "trigger">;

type ShuffleBodyProps = ShuffleVariantProps &
  Pick<ShuffleWordsProps, "slots" | "glyphs" | "registerLetter"> & {
    containerRef: Ref<HTMLSpanElement>;
  };

function ShuffleBody({ text, className, slots, glyphs, registerLetter, containerRef }: ShuffleBodyProps) {
  return (
    <span ref={containerRef} className={cn(shuffleFontClasses, "inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        <ShuffleWords slots={slots} glyphs={glyphs} registerLetter={registerLetter} />
      </span>
    </span>
  );
}

/** Os dois hooks devolvem o mesmo formato: muda só quem decide as trocas. */
function PointerShuffle({ text, className }: ShuffleVariantProps) {
  const { slots, letterCount } = useMemo(() => layoutWords([text]), [text]);
  const { glyphs, containerRef, registerLetter } = useGlyphShuffle<HTMLSpanElement>(letterCount);
  return (
    <ShuffleBody
      text={text}
      className={className}
      slots={slots}
      glyphs={glyphs}
      registerLetter={registerLetter}
      containerRef={containerRef}
    />
  );
}

function AutoShuffle({ text, className }: ShuffleVariantProps) {
  const { slots, letterCount } = useMemo(() => layoutWords([text]), [text]);
  const { glyphs, containerRef, registerLetter } = useGlyphWave<HTMLSpanElement>(letterCount);
  return (
    <ShuffleBody
      text={text}
      className={className}
      slots={slots}
      glyphs={glyphs}
      registerLetter={registerLetter}
      containerRef={containerRef}
    />
  );
}

/**
 * Texto com o efeito de troca de letras do herói (fontes e formas coloridas),
 * para usar dentro de um título. O tamanho e o peso vêm do elemento pai.
 */
export function ShuffleText({ text, trigger = "pointer", className }: ShuffleTextProps) {
  return trigger === "auto" ? (
    <AutoShuffle text={text} className={className} />
  ) : (
    <PointerShuffle text={text} className={className} />
  );
}
