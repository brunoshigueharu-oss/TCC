"use client";

import { useState } from "react";

import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Intensidade da hora, de "sem uso" ao pico: um matiz só, do claro ao escuro. */
const levelClasses = ["bg-superficie-forte", "bg-comunidade/30", "bg-comunidade/55", "bg-comunidade/80", "bg-comunidade"];

/** Horas marcadas embaixo da faixa. */
const hourMarks = [0, 6, 12, 18, 23];

function toLevel(minutes: number, maxMinutes: number) {
  if (minutes === 0 || maxMinutes === 0) return 0;
  return Math.max(1, Math.ceil((minutes / maxMinutes) * (levelClasses.length - 1)));
}

type HourStripProps = {
  minutesByHour: number[];
};

/**
 * Faixa das 24 horas: quanto mais escura a célula, mais minutos de uso
 * naquela hora. A hora sob o cursor (ou em foco) aparece na linha de leitura.
 */
export function HourStrip({ minutesByHour }: HourStripProps) {
  const [activeHour, setActiveHour] = useState<number | null>(null);
  const maxMinutes = Math.max(...minutesByHour);
  const peakHour = minutesByHour.indexOf(maxMinutes);
  const shownHour = activeHour ?? peakHour;

  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-baseline justify-between gap-3 text-xs text-texto-secundario">
        <span>Horários de uso na semana</span>
        <span aria-live="polite" className="flex items-baseline gap-1.5">
          {activeHour === null ? "pico" : null}
          <span className="font-mono font-medium text-texto tabular-nums">
            {formatTwoDigits(shownHour)}h · {minutesByHour[shownHour]} min
          </span>
        </span>
      </p>

      <ol
        aria-label="Minutos de uso por hora do dia"
        onPointerLeave={() => setActiveHour(null)}
        className="grid grid-cols-24 gap-0.5"
      >
        {minutesByHour.map((minutes, hour) => (
          <li key={hour}>
            <button
              type="button"
              aria-label={`${hour}h: ${minutes} minutos`}
              onPointerEnter={() => setActiveHour(hour)}
              onFocus={() => setActiveHour(hour)}
              onBlur={() => setActiveHour(null)}
              className={cn(
                "block h-7 w-full cursor-default rounded-[2px] outline-none transition-transform duration-150 hover:scale-y-125 focus-visible:ring-2 focus-visible:ring-texto",
                levelClasses[toLevel(minutes, maxMinutes)],
                activeHour === hour && "ring-1 ring-texto",
              )}
            />
          </li>
        ))}
      </ol>

      <div aria-hidden className="flex justify-between font-mono text-[10px] text-texto-secundario tabular-nums">
        {hourMarks.map((hour) => (
          <span key={hour}>{formatTwoDigits(hour)}h</span>
        ))}
      </div>
    </div>
  );
}
