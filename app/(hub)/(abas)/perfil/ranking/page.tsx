import type { Metadata } from "next";

import { BackBar } from "@/components/back-bar";
import { Chip } from "@/components/chip";
import { SurfaceCard } from "@/components/surface-card";
import { formatNumber } from "@/lib/format";
import { getRanking, parseRankingPeriod, type RankingPeriod } from "../_data-access/get-ranking";
import { RankingList } from "./_components/ranking-list";

export const metadata: Metadata = { title: "Ranking de amigos" };

const periodOptions: { value: RankingPeriod; label: string; summary: string }[] = [
  { value: "semana", label: "Semana", summary: "nesta semana" },
  { value: "mes", label: "Mês", summary: "neste mês" },
];

/** Ranking de amigos (Figma: "Ranking de amigos"). O período fica em `?periodo=`. */
export default async function RankingPage({ searchParams }: PageProps<"/perfil/ranking">) {
  const period = parseRankingPeriod((await searchParams).periodo);
  const entries = await getRanking(period);
  const myIndex = entries.findIndex((entry) => entry.isCurrentUser);
  const me = entries[myIndex];
  const ahead = myIndex > 0 ? entries[myIndex - 1] : null;
  const summary = periodOptions.find((option) => option.value === period)?.summary ?? "";

  return (
    <>
      <BackBar href="/perfil" label="Ranking de amigos" />
      <main className="flex flex-col gap-5 pt-5 pb-8 lg:grid lg:w-full lg:max-w-[1040px] lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-x-8 lg:gap-y-5 lg:pt-6 lg:pb-0">
        <nav aria-label="Período do ranking" className="flex gap-2 px-4 lg:col-start-1 lg:row-start-1 lg:px-0">
          {periodOptions.map((option) => (
            <Chip
              key={option.value}
              href={`/perfil/ranking?periodo=${option.value}`}
              isActive={option.value === period}
              scroll={false}
            >
              {option.label}
            </Chip>
          ))}
        </nav>

        {me ? (
          <SurfaceCard className="flex flex-col gap-1 p-4 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:gap-2 lg:p-6">
            <p className="text-xs font-semibold text-texto-secundario">Sua posição {summary}</p>
            <p className="font-display text-lg leading-snug font-bold lg:text-[22px]">
              {me.position}º lugar · {formatNumber(me.xp)} XP
            </p>
            <p className="text-sm text-texto-secundario">
              {ahead
                ? `Faltam ${formatNumber(ahead.xp - me.xp + 1)} XP para passar ${ahead.name.split(" ")[0]}.`
                : "Você está na frente. Continue praticando para manter o lugar."}
            </p>
          </SurfaceCard>
        ) : null}

        <RankingList entries={entries} />

        <p className="px-4 text-xs text-texto-secundario lg:col-start-1 lg:row-start-3 lg:px-0">
          O ranking soma o XP de lições, práticas e respostas úteis na comunidade. Você pode sair dele
          em Configurações.
        </p>
      </main>
    </>
  );
}
