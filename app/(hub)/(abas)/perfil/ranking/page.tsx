import type { Metadata } from "next";

import { BackBar } from "@/components/back-bar";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { getRanking, parseRankingPeriod, type RankingPeriod } from "../_data-access/get-ranking";
import { CountUp } from "../_components/motion/count-up";
import { PeriodTabs, type PeriodOption } from "./_components/period-tabs";
import { RankingList } from "./_components/ranking-list";

export const metadata: Metadata = { title: "Ranking de amigos" };

const periodOptions: (PeriodOption & { summary: string })[] = [
  { value: "semana", label: "Semana", summary: "nesta semana" },
  { value: "mes", label: "Mês", summary: "neste mês" },
];

/** Ranking de amigos (Figma: "Ranking de amigos"). O período fica em `?periodo=`. */
export default async function RankingPage({ searchParams }: PageProps<"/perfil/ranking">) {
  const period: RankingPeriod = parseRankingPeriod((await searchParams).periodo);
  const entries = await getRanking(period);
  const myIndex = entries.findIndex((entry) => entry.isCurrentUser);
  const me = entries[myIndex];
  const ahead = myIndex > 0 ? entries[myIndex - 1] : null;
  const summary = periodOptions.find((option) => option.value === period)?.summary ?? "";

  return (
    <>
      <BackBar href="/perfil" label="Ranking de amigos" />
      <main className="flex flex-col gap-6 pb-10 lg:pb-0">
        {me ? (
          <header className="flex flex-col gap-5 px-4 pt-8 lg:flex-row lg:items-end lg:justify-between lg:px-0 lg:pt-10">
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                Sua posição {summary}
              </p>
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-[88px] leading-[0.85] font-extralight tracking-[-0.06em] tabular-nums lg:text-[128px]">
                  {formatTwoDigits(me.position)}
                </span>
                <span className="font-display text-2xl font-medium tracking-[-0.03em] text-texto-secundario">
                  de {entries.length}
                </span>
              </p>
            </div>
            <div className="flex max-w-[36ch] flex-col gap-1.5 lg:items-end lg:text-right">
              <p className="font-mono text-2xl font-light tracking-[-0.03em] tabular-nums">
                <CountUp value={me.xp} /> <span className="font-sans text-sm font-medium text-texto-secundario">XP</span>
              </p>
              <p className="text-sm leading-relaxed text-texto-secundario">
                {ahead
                  ? `Faltam ${formatNumber(ahead.xp - me.xp + 1)} XP para passar ${ahead.name.split(" ")[0]}. Uma lição já resolve.`
                  : "Você está na frente. Continue praticando para manter o lugar."}
              </p>
            </div>
          </header>
        ) : null}

        <PeriodTabs options={periodOptions} selected={period} />
        <RankingList entries={entries} />

        <p className="px-4 text-xs leading-relaxed text-texto-secundario lg:px-0">
          O ranking soma o XP de lições, práticas e respostas úteis na comunidade. Você pode sair dele em
          Configurações.
        </p>
      </main>
    </>
  );
}
