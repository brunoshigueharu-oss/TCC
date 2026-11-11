import { SectionHeading } from "@/components/section-heading";
import type { ActivityDay } from "@/lib/data/perfil";
import type { ConsistencySummary } from "../_data-access/get-my-profile";
import { ConsistencyHeatmap } from "./charts/consistency-heatmap";

type ConsistencySectionProps = {
  weeks: ActivityDay[][];
  summary: ConsistencySummary;
};

/**
 * Mapa de consistência de estudo: mostra o hábito (em que dias a pessoa
 * estudou), não só o total. Uma coluna por semana, da mais antiga à atual.
 */
export function ConsistencySection({ weeks, summary }: ConsistencySectionProps) {
  const stats = [
    { label: "dias com estudo", value: summary.activeDays },
    { label: "lições e práticas", value: summary.totalLessons },
    { label: "maior sequência", value: summary.longestStreakDays },
  ];

  return (
    <section aria-labelledby="consistencia" className="flex flex-col lg:col-span-7">
      <SectionHeading id="consistencia" title="Consistência" tone="acao" meta={`${weeks.length} semanas`} />

      <div className="flex flex-col gap-5 px-4 pt-5 lg:px-0 lg:pt-6">
        <dl className="flex gap-6 lg:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-xs text-texto-secundario">{stat.label}</dt>
              <dd className="font-mono text-2xl leading-none font-light tracking-[-0.04em] tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <ConsistencyHeatmap weeks={weeks} />
      </div>
    </section>
  );
}
