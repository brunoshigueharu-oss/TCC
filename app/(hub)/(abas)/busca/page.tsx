import { Hash, Search, Sparkles } from "lucide-react";
import type { Metadata } from "next";

import { Chip } from "@/components/chip";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { cn } from "@/lib/utils";
import { SearchForm } from "./_components/search-form";
import { SearchResults } from "./_components/search-results";
import {
  getSearchSuggestions,
  parseSearchQuery,
  parseSearchType,
  searchHub,
  type SearchResult,
  type SearchType,
} from "./_data-access/search-hub";

export const metadata: Metadata = { title: "Busca" };

const typeFilters: { id: SearchType; label: string }[] = [
  { id: "tudo", label: "Tudo" },
  { id: "licoes", label: "Lições" },
  { id: "posts", label: "Posts" },
  { id: "cursos", label: "Minicursos" },
  { id: "pessoas", label: "Pessoas" },
];

function buildSearchHref(query: string, type: SearchType) {
  const params = new URLSearchParams({ q: query });
  if (type !== "tudo") params.set("tipo", type);
  return `/busca?${params.toString()}`;
}

function formatResultsCount(count: number, query: string) {
  if (count === 0) return `Nenhum resultado para “${query}”`;
  return count === 1 ? `1 resultado para “${query}”` : `${count} resultados para “${query}”`;
}

/** Busca (Figma: "Busca"). Termo em `?q=`, filtro de tipo em `?tipo=`. */
export default async function SearchPage({ searchParams }: PageProps<"/busca">) {
  const params = await searchParams;
  const query = parseSearchQuery(params.q);
  const type = parseSearchType(params.tipo);
  const [found, suggestions] = await Promise.all([searchHub(query), getSearchSuggestions()]);

  const allResults: SearchResult[] = found
    ? [...found.results.licoes, ...found.results.posts, ...found.results.cursos, ...found.results.pessoas]
    : [];
  const visibleResults = !found ? [] : type === "tudo" ? allResults : found.results[type];
  const countFor = (id: SearchType) =>
    !found ? 0 : id === "tudo" ? allResults.length : found.results[id].length;

  return (
    <>
      <PageHeader title="Busca" icon={Search} tone="acao">
        <SearchForm query={query} type={type} />
        {found ? (
          <nav aria-label="Filtrar resultados" className="-mx-4 lg:mx-0">
            <ul className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:px-0">
              {typeFilters.map((filter) => (
                <li key={filter.id}>
                  <Chip href={buildSearchHref(query, filter.id)} isActive={filter.id === type}
                    className="whitespace-nowrap"
                  >
                    {filter.label} · {countFor(filter.id)}
                  </Chip>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </PageHeader>

      <main
        className={cn(
          "flex flex-col gap-7 pt-6 pb-8 lg:grid lg:items-start lg:gap-8 lg:pt-8 lg:pb-0",
          found && found.tags.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_300px]" : "lg:grid-cols-1",
        )}
      >
        {found ? (
          <>
            <section aria-labelledby="resultados" className="flex flex-col gap-2">
              <SectionHeading
                id="resultados"
                title={formatResultsCount(visibleResults.length, query)}
                icon={Search}
                tone="acao"
              />
              {visibleResults.length > 0 ? (
                <SearchResults results={visibleResults} />
              ) : (
                <SurfaceCard className="p-4">
                  <p className="text-sm text-texto-secundario">
                    Tente outro termo ou troque o filtro. Se for uma dúvida, você pode perguntar à
                    comunidade.
                  </p>
                </SurfaceCard>
              )}
            </section>

            {found.tags.length > 0 ? (
              <section aria-labelledby="tags" className="flex flex-col gap-2 lg:sticky lg:top-8">
                <SectionHeading id="tags" title="Tags" icon={Hash} tone="comunidade" />
                <ul className="flex flex-wrap gap-2 px-4 lg:px-0">
                  {found.tags.map((tag) => (
                    <li key={tag}>
                      <Chip href={`/comunidade/tags/${tag}`}>#{tag}</Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : (
          <section aria-labelledby="sugestoes" className="flex flex-col gap-2 lg:max-w-[720px]">
            <SectionHeading id="sugestoes" title="Buscas frequentes" icon={Sparkles} tone="acao" />
            <ul className="flex flex-wrap gap-2 px-4 lg:px-0">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <Chip href={buildSearchHref(suggestion, "tudo")}>{suggestion}</Chip>
                </li>
              ))}
            </ul>
            <p className="px-4 pt-2 text-sm text-texto-secundario lg:px-0">
              Busque por lições da trilha, posts da comunidade, minicursos e pessoas.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
