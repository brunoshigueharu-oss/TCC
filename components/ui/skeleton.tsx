import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Bloco de carregamento: faixa neutra com pulso lento. Dê o tamanho pelo
 * `className` (`h-4 w-40`). É decorativo — quem monta a tela de carregamento
 * coloca `aria-busy` e um texto para leitores de tela no contêiner.
 */
export function Skeleton({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="skeleton"
      className={cn("block animate-skeleton rounded-md bg-superficie-forte", className)}
      {...props}
    />
  );
}

/** Linha de texto de carregamento (altura de uma linha de corpo). */
export function SkeletonText({ className, ...props }: ComponentProps<"span">) {
  return <Skeleton className={cn("h-3.5 rounded-sm", className)} {...props} />;
}
