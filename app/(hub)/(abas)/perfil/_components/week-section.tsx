import { SectionHeading } from "@/components/section-heading";
import type { WeekDay } from "@/lib/data/perfil";
import { formatNumber } from "@/lib/format";
import { niceAxisMax } from "./charts/axis";
import { DayBars, type DayBar } from "./charts/day-bars";

type WeekSectionProps = {
  week: WeekDay[];
};

/** XP ganho em cada dia da semana, em colunas finas; hoje fica em verde-água. */
export function WeekSection({ week }: WeekSectionProps) {
  const totalXp = week.reduce((sum, day) => sum + day.xp, 0);
  const elapsed = week.filter((day) => !day.isFuture);
  const todayIndex = elapsed.length - 1;
  const axisMax = niceAxisMax(Math.max(...week.map((day) => day.xp)));

  const days: DayBar[] = week.map((day, index) => ({
    label: day.label,
    isFuture: day.isFuture,
    isToday: index === todayIndex,
    totalLabel: `${day.xp} XP`,
    segments: [{ name: "XP", value: day.xp, valueLabel: `${day.xp} XP`, color: index === todayIndex ? "acao" : "tinta" }],
  }));

  return (
    <section aria-labelledby="minha-semana" className="flex flex-col lg:col-span-5">
      <SectionHeading id="minha-semana" title="XP por dia" tone="acao" meta="esta semana" />

      <div className="flex flex-col gap-6 px-4 pt-5 lg:px-0 lg:pt-6">
        <p className="flex items-baseline gap-2">
          <span className="font-mono text-[40px] leading-none font-extralight tracking-[-0.05em] tabular-nums">
            {formatNumber(totalXp)}
          </span>
          <span className="text-sm text-texto-secundario">
            XP em {elapsed.filter((day) => day.xp > 0).length} de {elapsed.length} dias
          </span>
        </p>
        <DayBars
          days={days}
          axisMax={axisMax}
          axisLabels={{ top: formatNumber(axisMax), middle: formatNumber(axisMax / 2) }}
          label="XP por dia da semana"
        />
      </div>
    </section>
  );
}
