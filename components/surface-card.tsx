import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  /** Elemento HTML do cartão (padrão: div). */
  as?: "div" | "section" | "article" | "aside";
};

/**
 * Cartão branco do hub, no padrão da Home: cantos de 16px e contorno fino.
 * Vive sobre o fundo `superficie`. Por padrão ocupa a largura com gutter de
 * 16px (`mx-4`); passe `className="mx-0"` quando estiver dentro de lista/grade.
 */
export function SurfaceCard({ as: Element = "div", className, ...props }: SurfaceCardProps) {
  return (
    <Element
      className={cn("mx-4 overflow-hidden rounded-2xl bg-fundo ring-1 ring-linha/70", className)}
      {...props}
    />
  );
}
