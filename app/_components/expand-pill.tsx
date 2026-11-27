import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import type { Accent } from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import { AccentDot } from "./accent-dot";
import { ExpandPanel } from "./expand-panel";

type ExpandPillPanelProps = {
  /** Texto da pílula. */
  label: string;
  /** Cor da bolinha: a do pilar do item, ou `acao`. */
  accent: Accent;
  /** Rótulo pequeno e título do painel aberto. */
  eyebrow: string;
  title: string;
  /** Largura da pílula (a forma é sempre a mesma). */
  className?: string;
  children: ReactNode;
};

/**
 * "Clicar expande" (ponto verde do rascunho) em forma de pílula: bolinha,
 * rótulo e "+". Mesma forma no palco e na solução; o painel cresce a partir
 * dela.
 */
export function ExpandPillPanel({ label, accent, eyebrow, title, className, children }: ExpandPillPanelProps) {
  return (
    <ExpandPanel
      eyebrow={eyebrow}
      title={title}
      triggerClassName={cn(
        "group flex min-h-11 items-center gap-2.5 rounded-full border border-linha bg-fundo py-2 pr-3 pl-4 text-left text-[15px] leading-snug font-medium outline-none transition-[border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-texto focus-visible:ring-2 focus-visible:ring-texto active:translate-y-0",
        className,
      )}
      trigger={
        <>
          <AccentDot accent={accent} className="size-2 transition-transform duration-200 group-hover:scale-150" />
          <span className="flex-1">{label}</span>
          <Plus
            aria-hidden
            className="size-4 shrink-0 text-texto-secundario transition-transform duration-300 group-hover:rotate-90 group-hover:text-texto"
            strokeWidth={1.5}
          />
        </>
      }
    >
      {children}
    </ExpandPanel>
  );
}
