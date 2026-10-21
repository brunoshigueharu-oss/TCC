import { ListChecks } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";

type CriteriaListProps = {
  criteria: string[];
};

/** Critérios que a IA usa para avaliar a resposta, numerados. */
export function CriteriaList({ criteria }: CriteriaListProps) {
  return (
    <section aria-labelledby="criterios" className="flex flex-col gap-2">
      <SectionHeading id="criterios" title="Critérios de avaliação" icon={ListChecks} tone="pratica" />
      <SurfaceCard>
        <ol className="divide-y divide-linha">
          {criteria.map((criterion, index) => (
            <li key={criterion} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pratica/15 text-xs font-bold"
              >
                {index + 1}
              </span>
              {criterion}
            </li>
          ))}
        </ol>
      </SurfaceCard>
    </section>
  );
}
