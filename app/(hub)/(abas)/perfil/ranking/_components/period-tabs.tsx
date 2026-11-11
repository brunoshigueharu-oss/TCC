import Link from "next/link";

import { cn } from "@/lib/utils";
import type { RankingPeriod } from "../../_data-access/get-ranking";

export type PeriodOption = { value: RankingPeriod; label: string };

type PeriodTabsProps = {
  options: PeriodOption[];
  selected: RankingPeriod;
};

/** Semana / Mês com sublinhado; o período fica na URL (`?periodo=`). */
export function PeriodTabs({ options, selected }: PeriodTabsProps) {
  return (
    <nav aria-label="Período do ranking" className="mx-4 lg:mx-0">
      <ul className="flex gap-6 border-b border-linha">
        {options.map((option) => {
          const isActive = option.value === selected;
          return (
            <li key={option.value}>
              <Link
                href={`/perfil/ranking?periodo=${option.value}`}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex h-11 items-center text-sm font-semibold outline-none transition-colors focus-visible:underline",
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-texto after:transition-transform after:duration-200",
                  isActive ? "text-texto after:scale-x-100" : "text-texto-secundario after:scale-x-0 hover:text-texto hover:after:scale-x-100",
                )}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
