"use client";

import { useState } from "react";

import type { ActivityDay } from "@/lib/data/perfil";
import { cn } from "@/lib/utils";

/** Intensidade do dia, de "sem estudo" ao dia mais cheio: um matiz só, do claro ao escuro. */
const levelClasses = ["bg-superficie-forte", "bg-acao/30", "bg-acao/55", "bg-acao/80", "bg-acao"];

const weekdayLabels = ["S", "T", "Q", "Q", "S", "S", "D"];
/** Semanas mais antigas que só aparecem no computador. */
const MOBILE_HIDDEN_WEEKS = 10;

const dayFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" });

function toLevel(xp: number, maxXp: number) {
  if (xp === 0 || maxXp === 0) return 0;
  return Math.max(1, Math.ceil((xp / maxXp) * (levelClasses.length - 1)));
}

function describeDay(day: ActivityDay) {
  const date = dayFormatter.format(new Date(day.date)).replaceAll(".", "");
  if (day.isFuture) return { date, value: "ainda não chegou" };
  if (day.xp === 0) return { date, value: "sem estudo" };
  return { date, value: `${day.xp} XP · ${day.lessons} ${day.lessons === 1 ? "lição" : "lições"}` };
}

type ConsistencyHeatmapProps = {
  weeks: ActivityDay[][];
};

/**
 * Mapa de consistência: uma coluna por semana, uma célula por dia. Passar o
 * mouse, tocar ou focar uma célula mostra o dia na linha de leitura acima da
 * grade (nada fica escondido só no hover: a célula também tem nome acessível).
 */
export function ConsistencyHeatmap({ weeks }: ConsistencyHeatmapProps) {
  const [active, setActive] = useState<ActivityDay | null>(null);
  const maxXp = Math.max(...weeks.flat().map((day) => day.xp));
  const reading = active ? describeDay(active) : null;

  return (
    <div className="flex flex-col gap-3">
      <p aria-live="polite" className="flex min-h-5 items-baseline gap-2 text-xs text-texto-secundario">
        {reading ? (
          <>
            <span className="font-mono font-medium text-texto tabular-nums">{reading.value}</span>
            <span>{reading.date}</span>
          </>
        ) : (
          <span>Passe pelo mapa para ver cada dia.</span>
        )}
      </p>

      <div className="flex gap-2">
        <ul aria-hidden className="grid grid-rows-7 gap-[3px] pt-5 font-mono text-[9px] leading-none text-texto-secundario">
          {weekdayLabels.map((label, index) => (
            <li key={index} className={cn("flex items-center", index % 2 === 1 && "invisible")}>
              {label}
            </li>
          ))}
        </ul>

        <ol
          aria-label="Estudo por dia nas últimas semanas"
          onPointerLeave={() => setActive(null)}
          className="flex min-w-0 flex-1 gap-[3px]"
        >
          {weeks.map((week, weekIndex) => {
            const firstDay = new Date(week[0].date);
            const startsMonth = weekIndex === 0 || firstDay.getUTCDate() <= 7;

            return (
              <li
                key={week[0].date}
                className={cn("flex min-w-0 flex-1 flex-col gap-[3px]", weekIndex < MOBILE_HIDDEN_WEEKS && "hidden lg:flex")}
              >
                <span aria-hidden className="h-4 font-mono text-[9px] leading-none whitespace-nowrap text-texto-secundario uppercase">
                  {startsMonth ? monthFormatter.format(firstDay).replace(".", "") : ""}
                </span>
                {week.map((day) => {
                  const { date, value } = describeDay(day);
                  return (
                    <button
                      key={day.date}
                      type="button"
                      aria-label={`${date}: ${value}`}
                      onPointerEnter={() => setActive(day)}
                      onFocus={() => setActive(day)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(day)}
                      className={cn(
                        "aspect-square w-full cursor-default rounded-[3px] outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-texto",
                        day.isFuture ? "border border-dashed border-linha" : levelClasses[toLevel(day.xp, maxXp)],
                        active?.date === day.date && "ring-1 ring-texto",
                      )}
                    />
                  );
                })}
              </li>
            );
          })}
        </ol>
      </div>

      <p aria-hidden className="flex items-center justify-end gap-1.5 font-mono text-[10px] text-texto-secundario">
        menos
        {levelClasses.map((levelClass) => (
          <span key={levelClass} className={cn("size-2.5 rounded-[2px]", levelClass)} />
        ))}
        mais
      </p>
    </div>
  );
}
