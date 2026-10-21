import { TrendingDown, TrendingUp } from "lucide-react";

import type { AiUsage } from "@/lib/data/uso-ias";
import { formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Alturas possíveis da barra, do menor para o maior. Classes literais porque
 * o Tailwind não lê nomes montados; os tokens do dia viram um destes degraus.
 */
const barHeights = ["h-1", "h-3", "h-6", "h-9", "h-12", "h-15", "h-18", "h-20"];

/** Intensidade do mapa de horários, de "sem uso" a "pico". */
const heatLevels = [
  "bg-superficie-forte",
  "bg-comunidade/25",
  "bg-comunidade/50",
  "bg-comunidade/75",
  "bg-comunidade",
];

/** Horas marcadas embaixo do mapa. */
const hourMarks = [0, 6, 12, 18, 23];

function toStep(value: number, max: number, steps: number) {
  if (max === 0 || value === 0) return 0;
  return Math.max(1, Math.round((value / max) * (steps - 1)));
}

function formatChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

type AiUsageChartsProps = {
  usage: AiUsage;
  /** Ex.: ["Claude", "Codex"] — vira "Somando Claude e Codex" na aba Todas. */
  sourceNames: string[];
};

/** Total de tokens da semana, barras por dia e mapa dos horários de uso. */
export function AiUsageCharts({ usage, sourceNames }: AiUsageChartsProps) {
  const totalTokens = usage.week.reduce((sum, day) => sum + day.tokens, 0);
  const maxTokens = Math.max(...usage.week.map((day) => day.tokens));
  const change = formatChange(totalTokens, usage.previousWeekTokens);
  const maxMinutes = Math.max(...usage.minutesByHour);
  const peakHour = usage.minutesByHour.indexOf(maxMinutes);
  const ChangeIcon = change !== null && change < 0 ? TrendingDown : TrendingUp;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-2xl leading-none font-bold">{formatCompact(totalTokens)} tokens</span>
          <span className="text-xs font-semibold text-texto-secundario">esta semana</span>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-texto-secundario">
          {change === null ? null : (
            <>
              <ChangeIcon aria-hidden className="size-3.5" strokeWidth={2.5} />
              <span>
                {change > 0 ? "+" : ""}
                {change}% em relação à semana passada
              </span>
            </>
          )}
          {sourceNames.length > 1 ? <span>· Somando {sourceNames.join(" e ")}</span> : null}
        </p>
      </div>

      <ul aria-label="Tokens por dia" className="grid grid-cols-7 items-end gap-2">
        {usage.week.map((day) => (
          <li key={day.label} className="flex flex-col items-center gap-1.5">
            <span className="flex h-20 w-full items-end justify-center">
              <span
                className={cn(
                  "w-full max-w-7 rounded-md",
                  barHeights[toStep(day.tokens, maxTokens, barHeights.length)],
                  day.tokens > 0 ? "bg-comunidade" : "bg-superficie-forte",
                )}
              />
            </span>
            <span className={cn("text-xs", day.isFuture ? "text-desativado" : "text-texto-secundario")}>
              {day.label}
            </span>
            <span className="sr-only">
              {day.isFuture ? "ainda não chegou" : `${formatCompact(day.tokens)} tokens`}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-semibold text-texto-secundario">Horários em que você mais usa</span>
          <span className="text-texto-secundario">Pico às {peakHour}h</span>
        </p>
        <ul aria-label="Uso por hora do dia" className="grid grid-cols-24 gap-0.5">
          {usage.minutesByHour.map((minutes, hour) => (
            <li
              key={hour}
              className={cn("h-6 rounded-sm", heatLevels[toStep(minutes, maxMinutes, heatLevels.length)])}
            >
              <span className="sr-only">
                {hour}h: {minutes} minutos
              </span>
            </li>
          ))}
        </ul>
        <div aria-hidden className="flex justify-between text-xs text-texto-secundario">
          {hourMarks.map((hour) => (
            <span key={hour}>{hour}h</span>
          ))}
        </div>
      </div>
    </div>
  );
}
