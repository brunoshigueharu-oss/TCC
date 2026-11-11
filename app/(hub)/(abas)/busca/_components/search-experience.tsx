"use client";

import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { ActionLink } from "@/components/action-link";
import { cn } from "@/lib/utils";
import { clearSearches, forgetSearch, rememberSearch, useRecentSearches } from "../_lib/recent-searches";
import { GROUP_PREVIEW_LIMIT, searchItems } from "../_lib/search-items";
import { kindLabels, searchKinds, type SearchData, type SearchFilter, type SearchItem } from "../_lib/search-types";
import { HighlightedText } from "./highlighted-text";

/** Espera (ms) depois da última tecla para gravar o termo na URL. */
const URL_SYNC_DELAY_MS = 250;

// Marcador de cada tipo (classes literais: o Tailwind não enxerga nomes montados).
const kindMarkerClasses: Record<SearchItem["kind"], string> = {
  licoes: "bg-trilha",
  cursos: "bg-pratica",
  posts: "bg-comunidade",
  pessoas: "bg-texto-secundario",
};

const sectionLabelClass =
  "flex min-h-11 items-center gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase";

type SearchExperienceProps = {
  data: SearchData;
  initialQuery: string;
};

/**
 * Busca do hub: campo grande, resultados a cada tecla, agrupados por tipo e
 * com o termo destacado. Teclado: ↑ ↓ percorrem os resultados, Enter abre,
 * Esc limpa e "/" volta ao campo. O termo fica na URL (`?q=`).
 */
export function SearchExperience({ data, initialQuery }: SearchExperienceProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilter>("tudo");
  const [activeIndex, setActiveIndex] = useState(-1);
  const recent = useRecentSearches();

  const grouped = useMemo(() => searchItems(data.items, query), [data.items, query]);
  const totalCount = grouped ? searchKinds.reduce((sum, kind) => sum + grouped[kind].length, 0) : 0;

  /** Grupos visíveis com o filtro atual; em "Tudo" cada grupo mostra só o começo. */
  const visibleGroups = grouped
    ? searchKinds
        .filter((kind) => (filter === "tudo" || filter === kind) && grouped[kind].length > 0)
        .map((kind) => ({
          kind,
          total: grouped[kind].length,
          items: filter === "tudo" ? grouped[kind].slice(0, GROUP_PREVIEW_LIMIT) : grouped[kind],
        }))
    : [];
  const flatItems = visibleGroups.flatMap((group) => group.items);
  const activeItem = activeIndex >= 0 ? flatItems[activeIndex] : undefined;
  const optionId = (item: SearchItem) => `${listboxId}-${item.kind}-${item.id}`;

  // Termo na URL, sem recarregar a página (o Next sincroniza com o router).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const term = query.trim();
      window.history.replaceState(null, "", term ? `/busca?q=${encodeURIComponent(term)}` : "/busca");
    }, URL_SYNC_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  // "/" em qualquer ponto da página volta ao campo.
  useEffect(() => {
    function handleSlash(event: globalThis.KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleSlash);
    return () => window.removeEventListener("keydown", handleSlash);
  }, []);

  // Mantém o resultado ativo à vista ao navegar pelo teclado.
  useEffect(() => {
    if (!activeItem) return;
    document.getElementById(optionId(activeItem))?.scrollIntoView({ block: "nearest" });
    // optionId depende só do id do listbox, estável.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  function updateQuery(next: string) {
    setQuery(next);
    setActiveIndex(-1);
    setFilter("tudo");
  }

  function openItem(item: SearchItem) {
    rememberSearch(query);
    router.push(item.href);
  }

  function handleTermSelect(term: string) {
    updateQuery(term);
    rememberSearch(term);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && flatItems.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % flatItems.length);
    } else if (event.key === "ArrowUp" && flatItems.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? flatItems.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeItem) openItem(activeItem);
      else if (flatItems[0]) openItem(flatItems[0]);
    } else if (event.key === "Escape") {
      if (activeIndex >= 0) setActiveIndex(-1);
      else updateQuery("");
    }
  }

  const hasQuery = grouped !== null;
  const status = !hasQuery
    ? ""
    : totalCount === 0
      ? `Nenhum resultado para ${query}`
      : `${totalCount} ${totalCount === 1 ? "resultado" : "resultados"} para ${query}`;

  return (
    <MotionConfig reducedMotion="user">
      <header className="flex flex-col gap-5 border-b border-linha px-4 pt-8 pb-0 lg:px-0 lg:pt-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
          <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
          Busca
        </p>

        <div role="search" className="group/search relative flex items-center gap-3 pb-4">
          <Search
            aria-hidden
            className="size-6 shrink-0 text-texto-secundario transition-colors group-focus-within/search:text-texto lg:size-8"
            strokeWidth={1.75}
          />
          <label htmlFor="busca-campo" className="sr-only">
            Buscar lições, minicursos, posts e pessoas
          </label>
          <input
            ref={inputRef}
            id="busca-campo"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={flatItems.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={activeItem ? optionId(activeItem) : undefined}
            aria-describedby="busca-dica"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            autoFocus
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="O que você procura?"
            className="min-w-0 flex-1 bg-transparent font-display text-[28px] leading-tight font-medium tracking-[-0.035em] outline-none placeholder:text-desativado lg:text-[52px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                updateQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Limpar busca"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded-md px-2 py-1 font-mono text-xs text-texto-secundario ring-1 ring-linha lg:block">
              /
            </kbd>
          )}
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-texto transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within/search:scale-x-100"
          />
        </div>
        <p id="busca-dica" className="sr-only">
          Use as setas para percorrer os resultados e Enter para abrir.
        </p>
      </header>

      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>

      <main className="flex flex-col gap-8 pt-6 pb-10 lg:pt-8 lg:pb-0">
        {hasQuery && totalCount > 0 ? (
          <>
            <div role="toolbar" aria-label="Filtrar por tipo" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
              <ul className="flex w-max gap-6 border-b border-linha lg:w-auto">
                {(["tudo", ...searchKinds] as SearchFilter[]).map((option) => {
                  const count = option === "tudo" ? totalCount : (grouped?.[option].length ?? 0);
                  const isActive = filter === option;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        disabled={count === 0}
                        onClick={() => {
                          setFilter(option);
                          setActiveIndex(-1);
                        }}
                        className={cn(
                          "relative flex h-11 items-center gap-1.5 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:underline focus-visible:underline-offset-4 disabled:opacity-40",
                          isActive ? "text-texto" : "text-texto-secundario hover:text-texto",
                        )}
                      >
                        {option === "tudo" ? "Tudo" : kindLabels[option]}
                        <span className="font-mono text-[11px] font-normal tabular-nums text-texto-secundario">{count}</span>
                        {isActive ? (
                          <motion.span
                            layoutId="filtro-busca"
                            aria-hidden
                            className="absolute inset-x-0 -bottom-px h-0.5 bg-texto"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div id={listboxId} role="listbox" aria-label="Resultados da busca" className="flex flex-col gap-10">
              {visibleGroups.map((group) => (
                <section key={group.kind} role="group" aria-labelledby={`${listboxId}-${group.kind}`} className="flex flex-col">
                  <h2 id={`${listboxId}-${group.kind}`} className={cn(sectionLabelClass, "mx-4 justify-between lg:mx-0")}>
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className={cn("size-2 rounded-[2px]", kindMarkerClasses[group.kind])} />
                      {kindLabels[group.kind]}
                    </span>
                    <span className="font-mono font-normal tracking-normal text-texto-secundario tabular-nums">
                      {String(group.total).padStart(2, "0")}
                    </span>
                  </h2>
                  <ul className="divide-y divide-linha">
                    {group.items.map((item) => {
                      const isActive = item === activeItem;
                      return (
                        <li
                          key={item.id}
                          id={optionId(item)}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => openItem(item)}
                          onMouseMove={() => setActiveIndex(flatItems.indexOf(item))}
                          className={cn(
                            "group/option relative flex cursor-pointer items-center gap-4 px-4 py-4 transition-colors duration-150 lg:px-3",
                            isActive && "bg-superficie",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "absolute inset-y-3 left-0 w-0.5 rounded-full bg-texto transition-opacity duration-150",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-display text-[18px] leading-snug font-medium tracking-[-0.02em] lg:text-[20px]">
                              <HighlightedText text={item.title} query={query} />
                            </span>
                            <span className="truncate font-mono text-[11px] text-texto-secundario">{item.meta}</span>
                          </span>
                          <CornerDownLeft
                            aria-hidden
                            className={cn(
                              "hidden size-4 shrink-0 text-texto-secundario transition-opacity lg:block",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                            strokeWidth={1.75}
                          />
                        </li>
                      );
                    })}
                  </ul>
                  {filter === "tudo" && group.total > group.items.length ? (
                    <button
                      type="button"
                      onClick={() => {
                        setFilter(group.kind);
                        setActiveIndex(-1);
                      }}
                      className="group/more mx-4 flex min-h-11 w-fit items-center gap-1.5 text-sm font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:underline lg:mx-0"
                    >
                      Ver {group.total} {kindLabels[group.kind].toLowerCase()}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover/more:translate-x-0.5" strokeWidth={2} />
                    </button>
                  ) : null}
                </section>
              ))}
            </div>

            <p aria-hidden className="hidden gap-5 font-mono text-[11px] text-texto-secundario lg:flex">
              <span>↑ ↓ navegar</span>
              <span>Enter abrir</span>
              <span>Esc limpar</span>
            </p>
          </>
        ) : null}

        {hasQuery && totalCount === 0 ? (
          <section aria-labelledby="sem-resultado" className="flex flex-col items-start gap-5 px-4 py-6 lg:px-0 lg:py-10">
            <h2
              id="sem-resultado"
              className="max-w-[22ch] font-display text-[30px] leading-[1.05] font-medium tracking-[-0.035em] text-balance lg:text-[44px]"
            >
              Nada encontrado para “{query.trim()}”.
            </h2>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-texto-secundario">
              Confira a grafia ou tente uma palavra mais curta. Se for uma dúvida, a turma pode ajudar.
            </p>
            <ActionLink href="/comunidade/novo">Perguntar à comunidade</ActionLink>
            <div className="flex flex-col gap-2 pt-4">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Experimente</p>
              <ul className="flex flex-wrap gap-2">
                {data.suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <TermButton term={suggestion} onSelect={handleTermSelect} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {!hasQuery ? (
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <section aria-labelledby="recentes" className="flex flex-col">
              <h2 id="recentes" className={cn(sectionLabelClass, "mx-4 justify-between lg:mx-0")}>
                <span className="flex items-center gap-2.5">
                  <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
                  Recentes
                </span>
                {recent.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearSearches}
                    className="flex min-h-11 items-center font-mono text-[11px] font-normal tracking-normal text-texto-secundario normal-case outline-none hover:text-texto focus-visible:underline"
                  >
                    limpar
                  </button>
                ) : null}
              </h2>
              {recent.length > 0 ? (
                <ul className="mx-4 divide-y divide-linha lg:mx-0">
                  {recent.map((term) => (
                    <li key={term} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleTermSelect(term)}
                        className="flex min-h-12 flex-1 items-center rounded-sm text-left text-[15px] outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-texto"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => forgetSearch(term)}
                        aria-label={`Remover “${term}” das recentes`}
                        className="flex size-11 items-center justify-center rounded-full text-texto-secundario outline-none hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
                      >
                        <X aria-hidden className="size-4" strokeWidth={1.75} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mx-4 py-4 text-sm leading-relaxed text-texto-secundario lg:mx-0">
                  Suas buscas aparecem aqui, só neste aparelho.
                </p>
              )}
            </section>

            <section aria-labelledby="sugestoes" className="flex flex-col">
              <h2 id="sugestoes" className={cn(sectionLabelClass, "mx-4 lg:mx-0")}>
                <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                Buscas frequentes
              </h2>
              <ul className="mx-4 flex flex-wrap gap-2 pt-4 lg:mx-0">
                {data.suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <TermButton term={suggestion} onSelect={handleTermSelect} />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="tags-busca" className="flex flex-col">
              <h2 id="tags-busca" className={cn(sectionLabelClass, "mx-4 lg:mx-0")}>
                <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
                Tags da comunidade
              </h2>
              <ul className="mx-4 divide-y divide-linha lg:mx-0">
                {data.tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      href={`/comunidade/tags/${tag.slug}`}
                      className="group/tag flex min-h-11 items-center justify-between rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-texto"
                    >
                      <span className="font-mono text-[13px] group-hover/tag:underline group-hover/tag:underline-offset-4">
                        #{tag.slug}
                      </span>
                      <span className="font-mono text-[11px] text-texto-secundario tabular-nums">
                        {tag.postsCount} {tag.postsCount === 1 ? "post" : "posts"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}
      </main>
    </MotionConfig>
  );
}

type TermButtonProps = {
  term: string;
  onSelect: (term: string) => void;
};

/** Termo sugerido em cápsula de linha fina. */
function TermButton({ term, onSelect }: TermButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(term)}
      className="flex h-9 items-center rounded-full px-3.5 text-sm font-medium ring-1 ring-linha outline-none transition-[box-shadow,background-color] duration-200 hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto"
    >
      {term}
    </button>
  );
}
