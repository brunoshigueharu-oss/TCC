import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DarkBandProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Faixa preta de uma seção da Landing, de borda a borda. Aplica o tema escuro
 * do hub só nela (a landing segue clara em `<html>`): os tokens (`bg-fundo`,
 * `text-texto`, `border-linha`...) invertem sozinhos para tudo o que estiver
 * dentro. As seções brancas não precisam de faixa.
 */
export function DarkBand({ children, className }: DarkBandProps) {
  return <div className={cn("dark bg-fundo text-texto", className)}>{children}</div>;
}
