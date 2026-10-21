import { Flame } from "lucide-react";

import { ProgressBar } from "@/components/progress-bar";
import type { HomeData } from "@/lib/data/home";
import { formatNumber } from "@/lib/format";
import { BauhausShapes } from "./bauhaus-shapes";
import { SectionHeading } from "@/components/section-heading";

type WeeklyStatsProps = Pick<HomeData, "dailyGoal" | "weeklyXp">;

/** "Sua semana": ilustração à esquerda, meta do dia e XP à direita. */
export function WeeklyStats({ dailyGoal, weeklyXp }: WeeklyStatsProps) {
  return (
    <section aria-labelledby="semana" className="flex flex-col gap-2">
      <SectionHeading id="semana" title="Sua semana" href="/perfil" icon={Flame} tone="pratica" />

      <div className="mx-4 flex overflow-hidden rounded-2xl bg-fundo ring-1 ring-linha/70">
        <div className="flex w-[42%] shrink-0 items-center justify-center rounded-r-[999px] bg-pratica/15 py-4">
          <BauhausShapes composition="semana" className="size-28" />
        </div>

        <dl className="flex flex-1 flex-col justify-center gap-4 p-4">
          <div className="flex flex-col gap-1.5">
            <dt className="text-xs font-semibold text-texto-secundario">Meta do dia</dt>
            <dd className="font-display text-lg leading-none font-bold">
              {dailyGoal.done} de {dailyGoal.target} lições
            </dd>
            <dd>
              <ProgressBar
                value={dailyGoal.done}
                max={dailyGoal.target}
                tone="pratica"
                label="Progresso da meta do dia"
              />
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-texto-secundario">XP da semana</dt>
            <dd className="font-display text-lg leading-none font-bold">{formatNumber(weeklyXp.xp)} XP</dd>
            <dd className="text-xs text-texto-secundario">{weeklyXp.friendsRank}º entre amigos</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
