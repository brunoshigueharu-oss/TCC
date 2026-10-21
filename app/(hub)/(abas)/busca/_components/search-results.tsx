import { BookOpen, GraduationCap, MessageCircle, User, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { cn } from "@/lib/utils";
import type { SearchResult, SearchResultKind } from "../_data-access/search-hub";

/** Rótulo, ícone e cor de pilar (classe literal) de cada tipo de resultado. */
export const resultKindStyles: Record<
  SearchResultKind,
  { label: string; icon: LucideIcon; toneClass: string }
> = {
  licoes: { label: "Lição", icon: BookOpen, toneClass: "bg-trilha" },
  posts: { label: "Post", icon: MessageCircle, toneClass: "bg-comunidade" },
  cursos: { label: "Minicurso", icon: GraduationCap, toneClass: "bg-comunidade" },
  pessoas: { label: "Pessoa", icon: User, toneClass: "bg-superficie-forte" },
};

type SearchResultsProps = {
  results: SearchResult[];
};

/** Resultados num cartão branco, um por linha, com o tipo à esquerda. */
export function SearchResults({ results }: SearchResultsProps) {
  return (
    <SurfaceCard>
      <ul className="divide-y divide-linha">
        {results.map((result) => {
          const { label, icon: Icon, toneClass } = resultKindStyles[result.kind];

          return (
            <li key={`${result.kind}-${result.id}`}>
              <Link href={result.href} className="flex gap-3 px-4 py-3 lg:gap-4 lg:px-5 lg:py-4 lg:transition-colors lg:hover:bg-superficie">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    toneClass,
                  )}
                >
                  <Icon className="size-5 text-texto" strokeWidth={1.75} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-xs font-semibold text-texto-secundario">{label}</span>
                  <span className="text-[15px] leading-snug font-semibold">{result.title}</span>
                  <span className="text-xs text-texto-secundario">{result.meta}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}
