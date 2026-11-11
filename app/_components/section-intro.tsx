import type { ReactNode } from "react";

import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionIntroProps = {
  /** Posição da seção na narrativa (vira "01", "02"...). */
  index: number;
  eyebrow: string;
  title: string;
  /** Id do título, ligado ao `aria-labelledby` da seção. */
  titleId: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Abertura de seção da Landing: linha fina, número em mono e rótulo em caixa
 * alta à esquerda; título grande à direita. Mesmo vocabulário do "03 / 06"
 * da vitrine.
 */
export function SectionIntro({ index, eyebrow, title, titleId, children, className }: SectionIntroProps) {
  return (
    <Reveal
      className={cn(
        "grid gap-6 border-t border-linha pt-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10",
        className,
      )}
    >
      <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.08em] uppercase">
        <span className="font-mono font-normal tabular-nums text-texto-secundario">{formatTwoDigits(index)}</span>
        <span aria-hidden className="h-px w-6 bg-linha" />
        {eyebrow}
      </p>
      <div className="flex flex-col gap-6">
        <h2
          id={titleId}
          className="font-display text-[clamp(32px,4.4vw,60px)] leading-[1.02] font-medium tracking-[-0.045em] text-balance"
        >
          {title}
        </h2>
        {children}
      </div>
    </Reveal>
  );
}

/** Casca de seção: largura máxima, gutter e respiro vertical iguais em todas. */
export function LandingSection({
  id,
  titleId,
  children,
  className,
}: {
  id: string;
  titleId: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("mx-auto w-full max-w-[1280px] scroll-mt-20 px-4 py-20 sm:px-10 lg:px-16 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
