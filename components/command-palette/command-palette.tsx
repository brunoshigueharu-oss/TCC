"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CornerDownLeft,
  GraduationCap,
  MessageSquare,
  PanelLeft,
  PencilRuler,
  PenLine,
  Play,
  Search,
  Settings,
  SunMoon,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { toggleNavCollapsed } from "@/components/side-nav-state";
import { setDarkTheme } from "@/components/theme-toggle";
import { Kbd } from "@/components/ui/kbd";
import {
  commandGroups,
  type CommandGroup,
  type CommandIcon,
  type CommandItem,
} from "@/lib/command-index";
import { cn } from "@/lib/utils";
import { findHighlight, indexItems, searchItems } from "./fuzzy";
import { COMMAND_PALETTE_EVENT } from "./open-command-palette";
import { ShortcutKeys } from "./shortcut-keys";

const RECENTS_STORAGE_KEY = "base8-paleta-recentes";
const MAX_RECENTS = 4;
/** Itens por grupo quando há consulta. */
const MAX_PER_GROUP = 6;
/** Tempo (ms) para a segunda tecla de uma sequência, como "G" depois "H". */
const SEQUENCE_WINDOW_MS = 900;

const groupLabels: Record<CommandGroup, string> = {
  acoes: "Ações",
  telas: "Ir para",
  licoes: "Lições",
  atividades: "Atividades",
  cursos: "Cursos",
  posts: "Posts",
  pessoas: "Pessoas",
};

const icons: Record<CommandIcon, LucideIcon> = {
  acao: Zap,
  tela: ArrowRight,
  licao: BookOpen,
  atividade: PencilRuler,
  curso: GraduationCap,
  post: MessageSquare,
  pessoa: User,
  tema: SunMoon,
  "barra-lateral": PanelLeft,
  configuracoes: Settings,
  notificacoes: Bell,
  escrever: PenLine,
  continuar: Play,
};

/** Telas mostradas com o campo vazio (o resto aparece ao digitar). */
const DEFAULT_SCREENS = ["/inicio", "/comunidade", "/educacao", "/perfil"].map((href) => `tela:${href}`);
/** Ações mostradas com o campo vazio. */
const DEFAULT_ACTIONS = 6;

type Row = { key: string; item: CommandItem };
type Section = { id: string; label: string; rows: Row[] };

function readRecents(): string[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(RECENTS_STORAGE_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function saveRecent(id: string) {
  try {
    const next = [id, ...readRecents().filter((value) => value !== id)].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem storage (aba privada): a paleta funciona, só não lembra dos recentes.
  }
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function toRows(sectionId: string, items: CommandItem[]): Row[] {
  return items.map((item) => ({ key: `${sectionId}/${item.id}`, item }));
}

function Highlighted({ label, query }: { label: string; query: string }) {
  const range = findHighlight(label, query);
  if (!range) return label;
  return (
    <>
      {label.slice(0, range[0])}
      <mark className="bg-transparent text-texto underline decoration-acao decoration-2 underline-offset-[5px]">
        {label.slice(range[0], range[1])}
      </mark>
      {label.slice(range[1])}
    </>
  );
}

type CommandPaletteProps = {
  /** Índice pronto, montado no servidor (`buildCommandIndex`). */
  items: CommandItem[];
};

/**
 * Paleta de comandos do hub (⌘K / Ctrl+K, ou "/"). Busca difusa por telas,
 * lições, cursos, posts, pessoas e ações; ↑ ↓ navegam, Enter abre, Esc fecha.
 * Com o campo vazio mostra os itens recentes e as ações principais. Também
 * cuida dos atalhos globais anunciados na lista (G H, ⌥T, ⌘B...).
 *
 * Acessibilidade: diálogo modal + combobox com `aria-activedescendant` (o
 * foco fica sempre no campo). No celular ocupa a tela inteira.
 */
export function CommandPalette({ items }: CommandPaletteProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef(0);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const indexed = useMemo(() => indexItems(items), [items]);
  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  /** Segunda tecla das sequências "G …" → destino. */
  const sequenceTargets = useMemo(() => {
    const targets = new Map<string, string>();
    for (const item of items) {
      if (item.shortcut?.isSequence && item.href) targets.set(item.shortcut.keys[1].toLowerCase(), item.href);
    }
    return targets;
  }, [items]);

  const openPalette = useCallback(() => {
    setQuery("");
    setActiveKey(null);
    setRecentIds(readRecents());
    setIsOpen(true);
  }, []);

  const sections = useMemo<Section[]>(() => {
    if (query.trim() === "") {
      const recents = recentIds.flatMap((id) => byId.get(id) ?? []);
      const actions = items.filter((item) => item.group === "acoes").slice(0, DEFAULT_ACTIONS);
      const screens = DEFAULT_SCREENS.flatMap((id) => byId.get(id) ?? []);
      return [
        { id: "recentes", label: "Recentes", rows: toRows("recentes", recents) },
        { id: "acoes", label: groupLabels.acoes, rows: toRows("acoes", actions) },
        { id: "telas", label: groupLabels.telas, rows: toRows("telas", screens) },
      ].filter((section) => section.rows.length > 0);
    }

    const results = searchItems(indexed, query);
    // Grupos na ordem do melhor resultado de cada um.
    const order = [...commandGroups].sort((first, second) => {
      const best = (group: CommandGroup) => results.find((result) => result.item.group === group)?.score ?? 0;
      return best(second) - best(first);
    });

    return order
      .map((group) => ({
        id: group,
        label: groupLabels[group],
        rows: toRows(
          group,
          results
            .filter((result) => result.item.group === group)
            .slice(0, MAX_PER_GROUP)
            .map((result) => result.item),
        ),
      }))
      .filter((section) => section.rows.length > 0);
  }, [query, recentIds, items, byId, indexed]);

  const rows = useMemo(() => sections.flatMap((section) => section.rows), [sections]);
  const activeRow = rows.find((row) => row.key === activeKey) ?? rows[0] ?? null;

  const runItem = useCallback(
    (item: CommandItem) => {
      saveRecent(item.id);
      setIsOpen(false);
      if (item.action === "alternar-tema") {
        setDarkTheme(!document.documentElement.classList.contains("dark"));
      } else if (item.action === "alternar-barra-lateral") {
        toggleNavCollapsed();
      } else if (item.href) {
        router.push(item.href);
      }
    },
    [router],
  );

  // Abre pelo evento global (botões "Buscar" espalhados pela casca).
  useEffect(() => {
    window.addEventListener(COMMAND_PALETTE_EVENT, openPalette);
    return () => window.removeEventListener(COMMAND_PALETTE_EVENT, openPalette);
  }, [openPalette]);

  // Atalhos globais.
  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (isMod && key === "k") {
        event.preventDefault();
        if (isOpen) setIsOpen(false);
        else openPalette();
        return;
      }

      if (isOpen || isTypingTarget(event.target)) return;

      if (isMod && key === "b") {
        event.preventDefault();
        toggleNavCollapsed();
        return;
      }
      if (event.altKey && event.code === "KeyT") {
        event.preventDefault();
        setDarkTheme(!document.documentElement.classList.contains("dark"));
        return;
      }
      if (isMod || event.altKey) return;

      if (key === "/") {
        event.preventDefault();
        openPalette();
        return;
      }

      const isSecondKey = Date.now() - sequenceRef.current < SEQUENCE_WINDOW_MS;
      sequenceRef.current = 0;
      if (isSecondKey) {
        const href = sequenceTargets.get(key);
        if (href) {
          event.preventDefault();
          router.push(href);
        }
        return;
      }
      if (key === "g") sequenceRef.current = Date.now();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, openPalette, router, sequenceTargets]);

  // Mantém o item ativo visível ao andar com as setas.
  useEffect(() => {
    if (!activeRow) return;
    listRef.current
      ?.querySelector(`[data-row-key="${CSS.escape(activeRow.key)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeRow]);

  function moveActive(step: number) {
    if (rows.length === 0) return;
    const index = activeRow ? rows.indexOf(activeRow) : -1;
    const next = (index + step + rows.length) % rows.length;
    setActiveKey(rows[next].key);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Enter durante a composição (acentos, IME) não executa nada.
    if (event.nativeEvent.isComposing) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        if (rows.length > 0) {
          event.preventDefault();
          setActiveKey(rows[0].key);
        }
        break;
      case "End":
        if (rows.length > 0) {
          event.preventDefault();
          setActiveKey(rows[rows.length - 1].key);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (activeRow) runItem(activeRow.item);
        break;
    }
  }

  const trimmedQuery = query.trim();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => (next ? openPalette() : setIsOpen(false))}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-tinta/45 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:bg-black/65" />
        <Dialog.Popup
          initialFocus={inputRef}
          className="fixed inset-0 z-[81] flex flex-col bg-fundo text-texto outline-none transition-[opacity,translate,scale] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 sm:inset-auto sm:top-[13vh] sm:left-1/2 sm:max-h-[min(560px,74vh)] sm:w-[min(640px,calc(100vw-2rem))] sm:-translate-x-1/2 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-linha sm:shadow-[0_32px_80px_-24px_rgb(0_0_0/0.45)] sm:data-ending-style:scale-[0.985] sm:data-starting-style:scale-[0.985]"
        >
          <Dialog.Title className="sr-only">Paleta de comandos</Dialog.Title>
          <Dialog.Description className="sr-only">
            Busque telas, lições, cursos, posts, pessoas e ações. Use as setas para navegar e Enter para abrir.
          </Dialog.Description>

          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-linha pr-2 pl-4 sm:h-[60px] sm:pr-4 sm:pl-5">
            <Search aria-hidden className="size-[18px] shrink-0 text-texto-secundario" strokeWidth={1.75} />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Buscar ou executar um comando"
              aria-expanded
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeRow ? `${listboxId}-${activeRow.key}` : undefined}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="Buscar telas, lições, pessoas ou ações…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveKey(null);
              }}
              onKeyDown={handleInputKeyDown}
              className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-texto-secundario/70 sm:text-[17px]"
            />
            <Dialog.Close className="flex h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto sm:hidden">
              Fechar
            </Dialog.Close>
            <Kbd aria-hidden className="hidden sm:inline-flex">
              esc
            </Kbd>
          </div>

          <MotionConfig reducedMotion="user">
            <div
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label="Resultados"
              className="min-h-0 flex-1 scroll-py-2 overflow-y-auto overscroll-contain p-2"
            >
              {sections.map((section) => (
                <div key={section.id} role="group" aria-labelledby={`${listboxId}-grupo-${section.id}`} className="pb-2 last:pb-0">
                  <div
                    id={`${listboxId}-grupo-${section.id}`}
                    role="presentation"
                    className="flex items-center justify-between px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase"
                  >
                    {section.label}
                    {trimmedQuery ? (
                      <span className="font-mono text-[10px] font-normal tracking-normal tabular-nums">
                        {String(section.rows.length).padStart(2, "0")}
                      </span>
                    ) : null}
                  </div>
                  {section.rows.map((row) => {
                    const isActive = row.key === activeRow?.key;
                    const Icon = icons[row.item.icon];

                    return (
                      <div
                        key={row.key}
                        id={`${listboxId}-${row.key}`}
                        role="option"
                        aria-selected={isActive}
                        data-row-key={row.key}
                        onPointerMove={() => {
                          if (!isActive) setActiveKey(row.key);
                        }}
                        onClick={() => runItem(row.item)}
                        className="relative flex min-h-12 cursor-default items-center gap-3 rounded-lg px-3 select-none sm:min-h-11"
                      >
                        {isActive ? (
                          <motion.span
                            layoutId="paleta-item-ativo"
                            aria-hidden
                            className="absolute inset-0 rounded-lg bg-superficie"
                            transition={{ type: "spring", stiffness: 900, damping: 60, mass: 0.6 }}
                          />
                        ) : null}
                        <Icon
                          aria-hidden
                          className={cn(
                            "relative size-4 shrink-0 transition-colors",
                            isActive ? "text-texto" : "text-texto-secundario",
                          )}
                          strokeWidth={1.75}
                        />
                        <span className="relative flex min-w-0 flex-1 flex-col py-1.5 sm:flex-row sm:items-baseline sm:gap-3 sm:py-0">
                          <span className="truncate text-[15px] font-medium">
                            <Highlighted label={row.item.label} query={trimmedQuery} />
                          </span>
                          {row.item.hint ? (
                            <span className="min-w-0 truncate text-[13px] text-texto-secundario sm:flex-1">
                              {row.item.hint}
                            </span>
                          ) : null}
                        </span>
                        {row.item.shortcut ? (
                          <ShortcutKeys shortcut={row.item.shortcut} className="relative hidden sm:inline-flex" />
                        ) : null}
                        <CornerDownLeft
                          aria-hidden
                          className={cn(
                            "relative hidden size-3.5 shrink-0 text-texto-secundario transition-opacity sm:block",
                            isActive ? "opacity-100" : "opacity-0",
                          )}
                          strokeWidth={2}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}

              {rows.length === 0 ? (
                <div className="flex flex-col items-start gap-3 px-3 py-8">
                  <p className="font-mono text-[11px] text-texto-secundario">00 resultados</p>
                  <p className="font-display text-2xl leading-tight font-medium tracking-[-0.03em]">
                    Nada encontrado para “{trimmedQuery}”.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/busca?q=${encodeURIComponent(trimmedQuery)}`);
                    }}
                    className="group flex min-h-11 items-center gap-2 text-[15px] font-semibold underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:ring-2 focus-visible:ring-texto"
                  >
                    Procurar na Busca completa
                    <ArrowRight
                      aria-hidden
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </button>
                </div>
              ) : null}
            </div>
          </MotionConfig>

          {/* Leitores de tela: quantos resultados há, sem tirar o foco do campo. */}
          <p role="status" aria-live="polite" className="sr-only">
            {rows.length === 0 ? "Nenhum resultado." : `${rows.length} ${rows.length === 1 ? "resultado" : "resultados"}.`}
          </p>

          <div
            aria-hidden
            className="hidden h-11 shrink-0 items-center gap-4 border-t border-linha px-5 text-xs text-texto-secundario sm:flex"
          >
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              navegar
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              abrir
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>/</Kbd>
              abrir de qualquer tela
            </span>
            <span className="ml-auto font-mono text-[11px] tabular-nums">
              {String(rows.length).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
