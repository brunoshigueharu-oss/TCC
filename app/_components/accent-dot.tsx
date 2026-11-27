import type { Accent } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

/**
 * Cor de cada pilar (classes literais: o Tailwind não enxerga nomes montados).
 * O limão quase some no branco, então ganha um contorno fino.
 */
const accentClasses: Record<Accent, string> = {
  trilha: "bg-trilha ring-1 ring-tinta/25 ring-inset",
  pratica: "bg-pratica",
  comunidade: "bg-comunidade",
  acao: "bg-acao",
};

type AccentDotProps = {
  accent: Accent;
  className?: string;
};

/** Bolinha com a cor do pilar de um item. Decorativa: a informação está no texto ao lado. */
export function AccentDot({ accent, className }: AccentDotProps) {
  return <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", accentClasses[accent], className)} />;
}
