"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState, type FocusEvent } from "react";

import type { GlossaryEntry } from "@/lib/data/trilha";
import { cn } from "@/lib/utils";

/** Largura do balão (px); usada para decidir se ele abre para a esquerda. */
const POPOVER_WIDTH = 272;

type GlossaryTermProps = {
  entry: GlossaryEntry;
  children: string;
};

/**
 * Termo técnico com explicação: sublinhado pontilhado que abre um balão curto
 * ao passar o cursor, focar pelo teclado ou tocar.
 */
function GlossaryTerm({ entry, children }: GlossaryTermProps) {
  const popoverId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);

  function open(target: HTMLElement) {
    const { left } = target.getBoundingClientRect();
    setAlignRight(left + POPOVER_WIDTH > window.innerWidth - 16);
    setIsOpen(true);
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={(event) => open(event.currentTarget)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-describedby={isOpen ? popoverId : undefined}
        aria-expanded={isOpen}
        onClick={(event) => (isOpen ? setIsOpen(false) : open(event.currentTarget))}
        onFocus={(event) => open(event.currentTarget)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="cursor-help rounded-sm underline decoration-texto-secundario decoration-dotted decoration-1 underline-offset-[5px] outline-none transition-colors hover:decoration-texto focus-visible:ring-2 focus-visible:ring-texto"
      >
        {children}
      </button>
      <AnimatePresence>
        {isOpen ? (
          <motion.span
            id={popoverId}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute top-full z-30 mt-2 flex w-[272px] max-w-[80vw] flex-col gap-1 rounded-xl border border-linha bg-fundo p-3.5 text-left",
              alignRight ? "right-0" : "left-0",
            )}
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
              <span aria-hidden className="size-1.5 rounded-[1px] bg-trilha" />
              Glossário · {entry.term}
            </span>
            <span className="font-texto text-sm leading-snug font-normal text-texto">{entry.definition}</span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type GlossaryTextProps = {
  text: string;
  glossary: GlossaryEntry[];
};

/**
 * Texto de lição com os termos do glossário marcados. Só a primeira ocorrência
 * de cada termo vira balão, para não poluir o parágrafo.
 */
export function GlossaryText({ text, glossary }: GlossaryTextProps) {
  const parts = useMemo(() => {
    const byMatch = new Map<string, GlossaryEntry>();
    for (const entry of glossary) {
      for (const match of entry.matches) byMatch.set(match.toLowerCase(), entry);
    }
    const alternatives = [...byMatch.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
    if (alternatives.length === 0) return [text];

    // Só casa palavra inteira (letras acentuadas contam como letra).
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${alternatives.join("|")})(?![\\p{L}\\p{N}])`, "giu");
    const seen = new Set<string>();
    const result: (string | { entry: GlossaryEntry; label: string })[] = [];
    let cursor = 0;

    for (const match of text.matchAll(pattern)) {
      const entry = byMatch.get(match[0].toLowerCase());
      if (!entry || seen.has(entry.id)) continue;
      seen.add(entry.id);
      if (match.index > cursor) result.push(text.slice(cursor, match.index));
      result.push({ entry, label: match[0] });
      cursor = match.index + match[0].length;
    }
    if (cursor < text.length) result.push(text.slice(cursor));
    return result;
  }, [text, glossary]);

  return (
    <>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <GlossaryTerm key={index} entry={part.entry}>
            {part.label}
          </GlossaryTerm>
        ),
      )}
    </>
  );
}
