import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { ShuffleText } from "./shuffle-text";

type SectionTitleProps = {
  /** Id do título, ligado ao `aria-labelledby` da seção. */
  id: string;
  title: string;
  /** Liga a troca de letras perto do cursor, como no título do herói. */
  hasShuffle?: boolean;
  /** Linha de apoio abaixo do título. */
  children?: ReactNode;
  className?: string;
};

/**
 * Título de seção da Landing: centralizado, em tamanho de cartaz, com a
 * troca de letras opcional.
 */
export function SectionTitle({ id, title, hasShuffle = false, children, className }: SectionTitleProps) {
  return (
    <Reveal className={cn("flex flex-col items-center gap-4 text-center", className)}>
      <h2
        id={id}
        className="font-display text-[clamp(40px,5.6vw,76px)] leading-none font-medium tracking-[-0.05em] text-balance"
      >
        {hasShuffle ? <ShuffleText text={title} /> : title}
      </h2>
      {children}
    </Reveal>
  );
}
