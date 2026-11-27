import type { ReactNode } from "react";

import type { SectionId } from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./section-title";

type LandingSectionProps = {
  id: SectionId;
  title: string;
  /** Liga a troca de letras perto do cursor no título. */
  hasShuffle?: boolean;
  /** Linha de apoio abaixo do título. */
  lead?: ReactNode;
  /** Enfeite acima do título (só onde a seção pede). */
  aboveTitle?: ReactNode;
  /**
   * `contained`: largura máxima e gutter da página. `full`: de borda a borda
   * (o carrossel do hub deixa as telas vizinhas cortadas nas pontas).
   */
  width?: "contained" | "full";
  className?: string;
  children: ReactNode;
};

const widthClasses = {
  contained: "mx-auto w-full max-w-[1280px] px-4 sm:px-10 lg:px-16",
  full: "",
} as const;

/**
 * Casca das seções da Landing: âncora, título ligado por `aria-labelledby` e
 * respiro vertical iguais em todas. `isolate` prende as camadas de dentro
 * (pinos, telas do carrossel, adesivos arrastados) na própria seção, para
 * nenhuma passar por cima do header fixo.
 */
export function LandingSection({
  id,
  title,
  hasShuffle = false,
  lead,
  aboveTitle,
  width = "contained",
  className,
  children,
}: LandingSectionProps) {
  const titleId = `${id}-titulo`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("isolate scroll-mt-20 py-20 lg:py-28", widthClasses[width], className)}
    >
      {aboveTitle}
      <SectionTitle
        id={titleId}
        title={title}
        hasShuffle={hasShuffle}
        className={width === "full" ? "px-4" : undefined}
      >
        {lead}
      </SectionTitle>
      {children}
    </section>
  );
}
