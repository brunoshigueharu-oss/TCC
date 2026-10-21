import { ClipboardList } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";

type TestDetailsProps = {
  prerequisite: string;
  totalMinutes: number;
  totalQuestions: number;
  passingPercent: number;
};

/** Regras do teste em linhas rótulo → valor. */
export function TestDetails({
  prerequisite,
  totalMinutes,
  totalQuestions,
  passingPercent,
}: TestDetailsProps) {
  const rows = [
    { label: "Pré-requisito", value: prerequisite },
    { label: "Duração", value: `${totalMinutes} minutos` },
    { label: "Questões", value: `${totalQuestions} questões` },
    { label: "Aprovação", value: `${passingPercent}% de acertos` },
  ];

  return (
    <section aria-labelledby="como-funciona" className="flex flex-col gap-2">
      <SectionHeading id="como-funciona" title="Como funciona" icon={ClipboardList} tone="trilha" />
      <SurfaceCard>
        <dl className="divide-y divide-linha">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <dt className="text-texto-secundario">{row.label}</dt>
              <dd className="font-semibold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </SurfaceCard>
    </section>
  );
}
