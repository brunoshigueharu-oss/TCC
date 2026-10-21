import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "../../_components/person-avatar";
import type { RankingEntry } from "../../_data-access/get-ranking";

type RankingListProps = {
  entries: RankingEntry[];
};

/**
 * Lista do ranking. A pessoa logada fica destacada em limão e leva ao Meu
 * perfil; as outras levam ao perfil público.
 */
export function RankingList({ entries }: RankingListProps) {
  return (
    <SurfaceCard className="lg:col-start-1 lg:row-start-2">
      <ol className="divide-y divide-linha">
        {entries.map((entry) => (
          <li key={entry.username}>
            <Link
              href={entry.isCurrentUser ? "/perfil" : `/comunidade/pessoas/${entry.username}`}
              aria-current={entry.isCurrentUser ? "true" : undefined}
              className={cn(
                "flex min-h-16 items-center gap-3 px-4 py-3 lg:px-5",
                entry.isCurrentUser && "bg-trilha/30",
                !entry.isCurrentUser && "lg:transition-colors lg:hover:bg-superficie",
              )}
            >
              <span className="w-6 shrink-0 font-display text-lg font-bold">{entry.position}º</span>
              <PersonAvatar name={entry.name} tone={entry.avatarTone} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">
                  {entry.isCurrentUser ? `${entry.name} (você)` : entry.name}
                </span>
                <span className="text-xs text-texto-secundario">
                  Nível {formatTwoDigits(entry.level)}
                </span>
              </span>
              <span className="text-sm font-semibold">{formatNumber(entry.xp)} XP</span>
            </Link>
          </li>
        ))}
      </ol>
    </SurfaceCard>
  );
}
