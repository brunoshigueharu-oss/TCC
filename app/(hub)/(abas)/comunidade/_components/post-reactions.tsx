"use client";

import { ArrowUp, Bookmark } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { useReaction } from "../_lib/reactions-store";

const EASE = [0.22, 1, 0.36, 1] as const;

type VoteButtonProps = {
  /** Chave da reação, ex.: `post:grid-layout` ou `answer:grid-layout:r1`. */
  reactionId: string;
  /** Votos antes do voto da pessoa. */
  baseCount: number;
  /** "column" = seta sobre o número (lista); "inline" = lado a lado. */
  layout?: "column" | "inline";
  /** O que está sendo votado, para leitores de tela (ex.: "pergunta"). */
  subject: string;
  className?: string;
};

/**
 * Votar como útil. Retorno imediato: o número troca com um deslize curto e a
 * seta ganha fundo. O voto fica no navegador (ver `reactions-store`).
 */
export function VoteButton({
  reactionId,
  baseCount,
  layout = "column",
  subject,
  className,
}: VoteButtonProps) {
  const [hasVoted, toggle] = useReaction("votes", reactionId);
  const shouldReduceMotion = useReducedMotion();
  const count = baseCount + (hasVoted ? 1 : 0);
  const offset = shouldReduceMotion ? 0 : 8;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hasVoted}
      aria-label={`Marcar ${subject} como útil. ${count} ${count === 1 ? "voto" : "votos"}`}
      className={cn(
        "group/vote relative z-10 flex shrink-0 items-center rounded-xl text-texto-secundario outline-none transition-colors duration-200 hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.96] aria-pressed:text-texto",
        layout === "column"
          ? "h-14 w-11 flex-col justify-center gap-1"
          : "h-11 gap-2 pr-3 pl-1.5",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200 group-hover/vote:-translate-y-0.5",
          hasVoted
            ? "bg-texto text-fundo"
            : "bg-superficie group-hover/vote:bg-superficie-forte",
        )}
      >
        <ArrowUp aria-hidden className="size-4" strokeWidth={2} />
      </span>
      <span className="relative flex h-4 min-w-[2ch] items-center justify-center overflow-hidden font-mono text-xs font-medium tabular-nums">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={count}
            initial={{ y: hasVoted ? offset : -offset, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: hasVoted ? -offset : offset, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

type SaveButtonProps = {
  postId: string;
  /** Mostra o texto "Salvar" / "Salvo" ao lado do ícone. */
  hasLabel?: boolean;
  className?: string;
};

/** Salvar o post para ler depois. O marcador preenche na hora. */
export function SaveButton({
  postId,
  hasLabel = false,
  className,
}: SaveButtonProps) {
  const [isSaved, toggle] = useReaction("saves", postId);
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      aria-label={
        hasLabel ? undefined : isSaved ? "Remover dos salvos" : "Salvar post"
      }
      className={cn(
        "relative z-10 flex h-11 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold text-texto-secundario outline-none transition-colors duration-200 hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto aria-pressed:text-texto",
        hasLabel ? "px-4" : "w-11",
        className,
      )}
    >
      <motion.span
        key={String(isSaved)}
        initial={shouldReduceMotion ? false : { scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="flex"
      >
        <Bookmark
          aria-hidden
          className={cn(
            "size-[18px]",
            isSaved ? "fill-current" : "fill-transparent",
          )}
          strokeWidth={1.75}
        />
      </motion.span>
      {hasLabel ? (isSaved ? "Salvo" : "Salvar") : null}
    </button>
  );
}
