import { Flame } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { WeekDay } from "@/lib/data/perfil";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Alturas possíveis da barra, do menor para o maior. Classes literais porque
 * o Tailwind não lê nomes montados; o XP do dia vira um destes degraus.
 */
const barHeights = ["h-1", "h-3", "h-6", "h-9", "h-12", "h-15", "h-18", "h-20"];

function getBarHeight(xp: number, maxXp: number) {
  if (maxXp === 0 || xp === 0) return barHeights[0];
  const step = Math.max(1, Math.round((xp / maxXp) * (barHeights.length - 1)));
  return barHeights[step];
}

type WeekSectionProps = {
  week: WeekDay[];
  streakDays: number;
};

/** Sequência e XP ganho em cada dia da semana. */
export function WeekSection({ week, streakDays }: WeekSectionProps) {
  const totalXp = week.reduce((sum, day) => sum + day.xp, 0);
  const maxXp = Math.max(...week.map((day) => day.xp));

  return (
    <section aria-labelledby="minha-semana" className="flex flex-col gap-2">
      <SectionHeading id="minha-semana" title="Sua semana" icon={Flame} tone="pratica" />
      <SurfaceCard className="flex flex-col gap-4 p-4">
        <dl className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-texto-secundario">Sequência</dt>
            <dd className="font-display text-lg leading-none font-bold">
              {streakDays} {streakDays === 1 ? "dia" : "dias"} seguidos
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-texto-secundario">XP da semana</dt>
            <dd className="font-display text-lg leading-none font-bold">{formatNumber(totalXp)} XP</dd>
          </div>
        </dl>

        <ul aria-label="XP por dia" className="grid grid-cols-7 items-end gap-2">
          {week.map((day) => (
            <li key={day.label} className="flex flex-col items-center gap-1.5">
              <span className="flex h-20 w-full items-end justify-center">
                <span
                  className={cn(
                    "w-full max-w-7 rounded-md",
                    getBarHeight(day.xp, maxXp),
                    day.xp > 0 ? "bg-pratica" : "bg-superficie-forte",
                  )}
                />
              </span>
              <span className={cn("text-xs", day.isFuture ? "text-desativado" : "text-texto-secundario")}>
                {day.label}
              </span>
              <span className="sr-only">{day.isFuture ? "ainda não chegou" : `${day.xp} XP`}</span>
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </section>
  );
}
