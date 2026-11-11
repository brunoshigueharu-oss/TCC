"use client";

import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type LessonTopBarProps = {
  backLabel: string;
  lessonTitle: string;
  current: number;
  total: number;
  /** Etapas já vistas (para preencher a barra de progresso). */
  isComplete: boolean;
  isFocusMode: boolean;
  onToggleFocus: () => void;
  onJump: (index: number) => void;
  /** Etapa mais distante já alcançada; dá para pular só até ela. */
  furthest: number;
};

/**
 * Barra do topo da lição: voltar, título curto, contador em mono, modo foco e
 * o progresso em segmentos (um por etapa). Clicar num segmento já visto volta
 * para ele.
 */
export function LessonTopBar({
  backLabel,
  lessonTitle,
  current,
  total,
  isComplete,
  isFocusMode,
  onToggleFocus,
  onJump,
  furthest,
}: LessonTopBarProps) {
  const FocusIcon = isFocusMode ? Minimize2 : Maximize2;

  return (
    <div className="sticky top-0 z-20 -mx-4 bg-fundo/90 px-4 backdrop-blur-md lg:mx-0 lg:px-0">
      <div className="flex h-14 items-center gap-2">
        <Link
          href="/educacao"
          aria-label={`Voltar para ${backLabel}`}
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-full outline-none transition-colors hover:bg-superficie focus-visible:ring-2 focus-visible:ring-texto"
        >
          <ArrowLeft aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
        <p className="flex min-w-0 flex-1 items-baseline gap-2 text-sm">
          <span className="hidden shrink-0 text-texto-secundario sm:inline">{backLabel}</span>
          <span aria-hidden className="hidden text-linha sm:inline">
            /
          </span>
          <span className="truncate font-medium">{lessonTitle}</span>
        </p>
        <span className="shrink-0 font-mono text-[11px] tracking-wide text-texto-secundario tabular-nums">
          {isComplete ? "FIM" : `${formatTwoDigits(current + 1)} / ${formatTwoDigits(total)}`}
        </span>
        <button
          type="button"
          onClick={onToggleFocus}
          aria-pressed={isFocusMode}
          aria-label={isFocusMode ? "Sair do modo foco" : "Entrar no modo foco"}
          title={isFocusMode ? "Sair do modo foco (F)" : "Modo foco (F)"}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-semibold outline-none ring-1 ring-linha transition-colors hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto aria-pressed:bg-texto aria-pressed:text-fundo aria-pressed:ring-texto"
        >
          <FocusIcon aria-hidden className="size-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">{isFocusMode ? "Sair do foco" : "Modo foco"}</span>
        </button>
      </div>

      <ol aria-label="Etapas da lição" className="flex gap-1 pb-3">
        {Array.from({ length: total }, (_, index) => {
          const isDone = isComplete || index < current;
          const isCurrent = !isComplete && index === current;
          const canJump = index <= furthest && !isCurrent;

          return (
            <li key={index} className="flex-1">
              <button
                type="button"
                disabled={!canJump}
                onClick={() => onJump(index)}
                aria-label={`Etapa ${index + 1}${isCurrent ? ", atual" : isDone ? ", concluída" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                className="group flex h-4 w-full items-center outline-none focus-visible:ring-2 focus-visible:ring-texto enabled:cursor-pointer"
              >
                <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-superficie-forte transition-[height] duration-200 group-enabled:group-hover:h-[5px]">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : isCurrent ? 0.5 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("absolute inset-0 origin-left rounded-full", isDone ? "bg-texto" : "bg-trilha")}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
