import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatNumber, formatTwoDigits } from "@/lib/format";
import { CountUp } from "./motion/count-up";
import { FillLine } from "./motion/fill-line";

type ProfileStatsProps = {
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  longestStreakDays: number;
  weeklyRank: number;
};

const itemClass = "flex flex-col-reverse gap-3 py-5 lg:py-7";
const valueClass = "font-mono text-[40px] leading-none font-extralight tracking-[-0.05em] tabular-nums lg:text-[64px]";
const unitClass = "ml-1.5 font-sans text-sm font-medium tracking-normal text-texto-secundario";
const labelClass = "text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase";

/**
 * Nível, XP, sequência e ranking em uma linha: números grandes e finos em
 * mono, rótulos em caixa alta, linhas no lugar de caixas. Embaixo, a linha do
 * caminho até o próximo nível.
 */
export function ProfileStats({ level, xp, nextLevelXp, streakDays, longestStreakDays, weeklyRank }: ProfileStatsProps) {
  const missingXp = Math.max(nextLevelXp - xp, 0);

  return (
    <section aria-label="Resumo do progresso" className="mx-4 border-y border-linha lg:mx-0">
      <dl className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-linha">
        <div className={`${itemClass} border-b border-linha pr-4 lg:border-b-0 lg:pr-6`}>
          <dt className={labelClass}>Nível</dt>
          <dd className={valueClass}>
            <CountUp value={level} format="twoDigits" duration={0.6} />
          </dd>
        </div>
        <div className={`${itemClass} border-b border-l border-linha pl-4 lg:border-b-0 lg:border-l-0 lg:px-6`}>
          <dt className={labelClass}>XP total</dt>
          <dd className={valueClass}>
            <CountUp value={xp} duration={1.1} />
          </dd>
        </div>
        <div className={`${itemClass} pr-4 lg:px-6`}>
          <dt className={labelClass}>
            Sequência
            <span className="ml-2 font-mono font-normal tracking-normal normal-case">recorde {longestStreakDays}</span>
          </dt>
          <dd className={valueClass}>
            <CountUp value={streakDays} format="twoDigits" duration={0.6} />
            <span className={unitClass}>{streakDays === 1 ? "dia" : "dias"}</span>
          </dd>
        </div>
        <div className={`${itemClass} border-l border-linha pl-4 lg:border-l-0 lg:pl-6`}>
          <dt className={labelClass}>
            <Link
              href="/perfil/ranking"
              className="group inline-flex items-center gap-1 outline-none hover:text-texto focus-visible:underline"
            >
              Ranking de amigos
              <ArrowUpRight
                aria-hidden
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </dt>
          <dd className={valueClass}>
            {weeklyRank}
            <span className={unitClass}>º na semana</span>
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2.5 border-t border-linha py-4">
        <FillLine value={xp} max={nextLevelXp} label="Progresso até o próximo nível" />
        <p className="flex items-baseline justify-between gap-4 text-xs text-texto-secundario">
          <span>
            Faltam <span className="font-medium text-texto">{formatNumber(missingXp)} XP</span> para o nível{" "}
            {formatTwoDigits(level + 1)}
          </span>
          <span className="font-mono tabular-nums">
            {formatNumber(xp)} / {formatNumber(nextLevelXp)}
          </span>
        </p>
      </div>
    </section>
  );
}
