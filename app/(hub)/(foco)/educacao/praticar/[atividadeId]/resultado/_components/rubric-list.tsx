import { Check, ClipboardCheck, Minus, X, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { CriterionResult } from "@/lib/data/praticar";
import { cn } from "@/lib/utils";

const resultInfo: Record<CriterionResult, { label: string; icon: LucideIcon; markerClass: string }> = {
  atendido: { label: "Atendido", icon: Check, markerClass: "bg-acao text-texto" },
  parcial: { label: "Parcial", icon: Minus, markerClass: "bg-superficie-forte text-texto" },
  "nao-atendido": { label: "Não atendido", icon: X, markerClass: "bg-texto text-fundo" },
};

type RubricListProps = {
  criteria: string[];
  results: CriterionResult[];
};

/** Rubrica: cada critério da atividade com o resultado da avaliação. */
export function RubricList({ criteria, results }: RubricListProps) {
  return (
    <section aria-labelledby="rubrica" className="flex flex-col gap-2">
      <SectionHeading id="rubrica" title="Rubrica" icon={ClipboardCheck} tone="pratica" />
      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {criteria.map((criterion, index) => {
            const { label, icon: Icon, markerClass } = resultInfo[results[index] ?? "nao-atendido"];
            return (
              <li key={criterion} className="flex items-center gap-3 px-4 py-3">
                <span className="min-w-0 flex-1 text-sm">{criterion}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
                  <span
                    aria-hidden
                    className={cn("flex size-5 items-center justify-center rounded-full", markerClass)}
                  >
                    <Icon className="size-3" strokeWidth={3} />
                  </span>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>
    </section>
  );
}
