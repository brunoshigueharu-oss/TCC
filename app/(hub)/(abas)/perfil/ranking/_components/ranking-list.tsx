import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { formatNumber, formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "../../_components/person-avatar";
import { FillLine } from "../../_components/motion/fill-line";
import type { RankingEntry } from "../../_data-access/get-ranking";

type RankingListProps = {
  entries: RankingEntry[];
};

/**
 * Lista do ranking em linhas: posição em mono, pessoa, XP e uma linha fina
 * proporcional ao líder. A pessoa logada ganha o marcador limão e leva ao Meu
 * perfil; as outras levam ao perfil público.
 */
export function RankingList({ entries }: RankingListProps) {
  const leaderXp = entries[0]?.xp ?? 0;

  return (
    <ol className="mx-4 divide-y divide-linha border-b border-linha lg:mx-0">
      {entries.map((entry, index) => (
        <li key={entry.username}>
          <Link
            href={entry.isCurrentUser ? "/perfil" : `/comunidade/pessoas/${entry.username}`}
            aria-current={entry.isCurrentUser ? "true" : undefined}
            className={cn(
              "group grid grid-cols-[32px_40px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-4 outline-none transition-colors hover:bg-superficie focus-visible:bg-superficie lg:-mx-3 lg:grid-cols-[48px_40px_minmax(0,1fr)_minmax(0,240px)_96px] lg:gap-x-5 lg:rounded-lg lg:px-3",
              entry.isCurrentUser && "bg-superficie",
            )}
          >
            <span className="font-mono text-2xl leading-none font-extralight tracking-[-0.04em] tabular-nums lg:text-[32px]">
              {formatTwoDigits(entry.position)}
            </span>
            <PersonAvatar name={entry.name} tone={entry.avatarTone} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-center gap-2 truncate text-[15px] font-medium">
                {entry.name}
                {entry.isCurrentUser ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-texto-secundario">
                    <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                    você
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-xs text-texto-secundario">nível {formatTwoDigits(entry.level)}</span>
            </span>
            <FillLine
              value={entry.xp}
              max={leaderXp}
              tone="tinta"
              delay={index * 0.06}
              label={`${formatNumber(entry.xp)} XP de ${formatNumber(leaderXp)} do primeiro lugar`}
              className="col-span-2 col-start-3 row-start-2 lg:col-span-1 lg:col-start-4 lg:row-start-1"
            />
            <span className="flex items-center justify-end gap-1.5 text-right font-mono text-sm tabular-nums lg:col-start-5">
              {formatNumber(entry.xp)}
              <span className="font-sans text-xs text-texto-secundario">XP</span>
              <ArrowUpRight
                aria-hidden
                className="hidden size-3.5 text-desativado transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto lg:block"
                strokeWidth={2}
              />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
