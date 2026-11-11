import { TrendingDown, TrendingUp } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import type { AiToolId } from "@/lib/data/uso-ias";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AiUsageData } from "../_data-access/get-ai-usage";
import { AiConnectCard } from "./ai-connect-card";
import { AiUsageTabs } from "./ai-usage-tabs";
import { niceAxisMax } from "./charts/axis";
import { DayBars, type DayBar, type SeriesColor } from "./charts/day-bars";
import { HourStrip } from "./charts/hour-strip";

/**
 * Cor fixa de cada ferramenta: segue a entidade, nunca a posição, então
 * filtrar uma aba não repinta as outras. Validada (claro e escuro) para
 * daltonismo entre azul e rosa.
 */
const toolColor: Record<AiToolId, SeriesColor> = {
  claude: "comunidade",
  codex: "pratica",
  copilot: "acao",
};

const legendBg: Record<SeriesColor, string> = {
  tinta: "bg-texto",
  acao: "bg-acao",
  comunidade: "bg-comunidade",
  pratica: "bg-pratica",
};

function getChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

type AiUsageSectionProps = {
  data: AiUsageData;
};

/** Uso das IAs de código conectadas (Claude, Codex, Copilot) — dados fictícios. */
export function AiUsageSection({ data }: AiUsageSectionProps) {
  const { tabs, selectedTab, disconnectedTools, usage, series } = data;
  const hasAnyConnected = tabs.some((tab) => tab.id !== "todas" && tab.isConnected);
  const selectedTool = disconnectedTools.find((tool) => tool.id === selectedTab);

  return (
    <section aria-labelledby="uso-das-ias" className="flex flex-col lg:col-span-12">
      <SectionHeading id="uso-das-ias" title="Uso das IAs" tone="comunidade" meta="tokens · esta semana" />

      <div className="flex flex-col gap-6 px-4 pt-5 lg:px-0 lg:pt-6">
        {hasAnyConnected ? <AiUsageTabs tabs={tabs} selectedTab={selectedTab} /> : null}

        {usage && series.length > 0 ? (
          <UsageCharts usage={usage} series={series} />
        ) : selectedTool ? (
          <AiConnectCard
            title={`Conecte o ${selectedTool.name}`}
            description="Assim o uso dele aparece aqui, junto com as outras ferramentas."
            tools={[selectedTool]}
          />
        ) : (
          <AiConnectCard
            title="Conecte suas IAs e acompanhe seu uso"
            description="Veja quantos tokens você gasta por dia e em que horários mais usa cada ferramenta."
            tools={disconnectedTools}
          />
        )}
      </div>
    </section>
  );
}

function UsageCharts({
  usage,
  series,
}: {
  usage: NonNullable<AiUsageData["usage"]>;
  series: AiUsageData["series"];
}) {
  const totalTokens = usage.week.reduce((sum, day) => sum + day.tokens, 0);
  const change = getChange(totalTokens, usage.previousWeekTokens);
  const ChangeIcon = change !== null && change < 0 ? TrendingDown : TrendingUp;
  const axisMax = niceAxisMax(Math.max(...usage.week.map((day) => day.tokens)));
  const todayIndex = usage.week.filter((day) => !day.isFuture).length - 1;

  const days: DayBar[] = usage.week.map((day, index) => ({
    label: day.label,
    isFuture: day.isFuture,
    isToday: index === todayIndex,
    totalLabel: `${formatCompact(day.tokens)} tokens`,
    segments: series.map((item) => ({
      name: item.name,
      value: item.tokensByDay[index] ?? 0,
      valueLabel: formatCompact(item.tokensByDay[index] ?? 0),
      color: toolColor[item.id],
    })),
  }));

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-12">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[48px] leading-none font-extralight tracking-[-0.05em] tabular-nums lg:text-[64px]">
            {formatCompact(totalTokens)}
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-texto-secundario">
            <span>tokens esta semana</span>
            {change !== null ? (
              <span className="flex items-center gap-1 font-mono text-texto tabular-nums">
                <ChangeIcon aria-hidden className="size-3.5" strokeWidth={2} />
                {change > 0 ? "+" : ""}
                {change}%
                <span className="font-sans text-texto-secundario">vs. semana passada</span>
              </span>
            ) : null}
          </p>
        </div>

        {series.length > 1 ? (
          <ul aria-label="Legenda" className="flex flex-col divide-y divide-linha border-y border-linha">
            {series.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span aria-hidden className={cn("size-2.5 rounded-[2px]", legendBg[toolColor[item.id]])} />
                <span className="flex-1">{item.name}</span>
                <span className="font-mono text-texto-secundario tabular-nums">{formatCompact(item.totalTokens)}</span>
                <span className="w-10 text-right font-mono text-xs text-texto-secundario tabular-nums">
                  {Math.round((item.totalTokens / totalTokens) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <HourStrip minutesByHour={usage.minutesByHour} />
      </div>

      <DayBars
        days={days}
        axisMax={axisMax}
        axisLabels={{ top: formatCompact(axisMax), middle: formatCompact(axisMax / 2) }}
        label="Tokens por dia da semana"
      />
    </div>
  );
}
