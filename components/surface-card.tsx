import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  /** Elemento HTML do cartão (padrão: div). */
  as?: "div" | "section" | "article" | "aside";
};

/**
 * Cartão do hub: cantos de 12px e linha fina, sem sombra. Vive sobre o
 * fundo branco (`fundo`); use com parcimônia — prefira linhas e tipografia
 * a caixas (ver `docs/direcao-visual.md`). Por padrão ocupa a largura com gutter de
 * 16px (`mx-4`) no celular e 0 no computador (a coluna já tem respiro); passe `className="mx-0"` quando estiver dentro de lista/grade.
 */
export function SurfaceCard({ as: Element = "div", className, ...props }: SurfaceCardProps) {
  return (
    <Element
      className={cn("mx-4 overflow-hidden rounded-xl border border-linha bg-fundo lg:mx-0", className)}
      {...props}
    />
  );
}
