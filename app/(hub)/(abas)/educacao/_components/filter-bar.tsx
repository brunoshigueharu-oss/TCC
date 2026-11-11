import Link from "next/link";

import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export type FilterOption = {
  id: string;
  label: string;
  href: string;
  count: number;
};

type FilterBarProps = {
  label: string;
  options: FilterOption[];
  activeId: string;
  className?: string;
};

/**
 * Filtro em texto com contagem em mono (ex.: "Prompt 03"). O ativo vira
 * pílula escura; os demais só ganham fundo no hover. O estado fica na URL.
 */
export function FilterBar({ label, options, activeId, className }: FilterBarProps) {
  return (
    <nav aria-label={label} className={cn("-mx-4 lg:mx-0", className)}>
      <ul className="flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
        {options.map((option) => {
          const isActive = option.id === activeId;
          return (
            <li key={option.id} className="shrink-0">
              <Link
                href={option.href}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.98]",
                  isActive ? "bg-texto text-fundo" : "text-texto-secundario hover:bg-superficie hover:text-texto",
                )}
              >
                {option.label}
                <span className={cn("font-mono text-[10px] tabular-nums", isActive ? "opacity-70" : "opacity-60")}>
                  {formatTwoDigits(option.count)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
