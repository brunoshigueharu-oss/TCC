"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, useTransition } from "react";

import { SectionHeading } from "@/components/section-heading";
import { DAILY_GOAL_MAX, DAILY_GOAL_MIN } from "@/lib/data/home";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { updateDailyGoal } from "../_actions/update-daily-goal";

type DailyGoalProps = {
  done: number;
  initialTarget: number;
  /** Lições que faltam no módulo atual (contando a em andamento). */
  remainingLessons: number;
  /** Duração média de uma lição, em minutos. */
  averageMinutes: number;
  moduleNumber: number | null;
};

const stepButtonClass =
  "flex size-11 items-center justify-center rounded-full border border-linha outline-none transition-[background-color,border-color,transform] duration-150 hover:border-texto hover:bg-superficie focus-visible:ring-2 focus-visible:ring-texto active:scale-95 disabled:pointer-events-none disabled:opacity-35";

function formatDays(days: number) {
  if (days <= 1) return "ainda hoje";
  return `em ${days} dias`;
}

/**
 * Meta do dia ajustável. Mudar a meta responde na hora: os segmentos se
 * redesenham e a projeção diz quanto tempo por dia ela pede e quando o módulo
 * termina nesse ritmo. A escolha vai para a Server Action; se ela recusar, a
 * meta volta ao valor anterior.
 */
export function DailyGoal({ done, initialTarget, remainingLessons, averageMinutes, moduleNumber }: DailyGoalProps) {
  const [target, setTarget] = useState(initialTarget);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const shouldReduceMotion = useReducedMotion();

  const isComplete = done >= target;
  const missing = Math.max(target - done, 0);
  const daysToFinish = Math.ceil(remainingLessons / target);

  function handleChange(nextTarget: number) {
    const previousTarget = target;
    setTarget(nextTarget);
    setError(null);
    startTransition(async () => {
      const result = await updateDailyGoal({ target: nextTarget });
      if (!result.success) {
        setTarget(previousTarget);
        setError(result.message ?? "Não foi possível salvar a meta.");
      }
    });
  }

  return (
    <section aria-labelledby="meta-do-dia" className="flex flex-col lg:col-span-4">
      <SectionHeading
        id="meta-do-dia"
        title="Meta de hoje"
        tone="pratica"
        meta={isComplete ? "cumprida" : "em curso"}
      />

      <div className="flex flex-col gap-6 px-4 pt-6 pb-7 lg:px-0 lg:pt-8">
        <div className="flex items-end justify-between gap-4">
          <p
            aria-label={`${done} de ${target} lições feitas hoje`}
            className="flex items-baseline font-mono text-[72px] leading-[0.85] font-extralight tracking-[-0.06em] tabular-nums lg:text-[88px]"
          >
            <span>{formatTwoDigits(done)}</span>
            <span className="px-1 text-desativado">/</span>
            <span className="relative inline-flex overflow-hidden text-texto-secundario">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={target}
                  initial={shouldReduceMotion ? false : { y: "55%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { y: "-55%", opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  {formatTwoDigits(target)}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          <div role="group" aria-label="Ajustar a meta diária" className="flex items-center gap-2 pb-1">
            <button
              type="button"
              aria-label="Diminuir a meta em uma lição"
              disabled={target <= DAILY_GOAL_MIN}
              onClick={() => handleChange(target - 1)}
              className={stepButtonClass}
            >
              <Minus aria-hidden className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Aumentar a meta em uma lição"
              disabled={target >= DAILY_GOAL_MAX}
              onClick={() => handleChange(target + 1)}
              className={stepButtonClass}
            >
              <Plus aria-hidden className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div aria-hidden className="flex gap-1">
          {Array.from({ length: target }, (_, index) => (
            <motion.span
              key={index}
              layout={!shouldReduceMotion}
              initial={shouldReduceMotion ? false : { opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={cn(
                "h-1.5 flex-1 origin-left rounded-full",
                index < done ? "bg-pratica" : "bg-superficie-forte",
              )}
            />
          ))}
        </div>

        <div aria-live="polite" className="flex flex-col gap-1.5">
          <p className="text-[15px] leading-snug font-medium">
            {isComplete
              ? "Meta de hoje cumprida."
              : missing === 1
                ? "Falta uma lição para fechar o dia."
                : `Faltam ${missing} lições para fechar o dia.`}
          </p>
          <p className="text-sm leading-relaxed text-texto-secundario">
            {target === 1 ? "Uma lição" : `${target} lições`} por dia pedem cerca de{" "}
            <span className="font-mono text-texto tabular-nums">{target * averageMinutes} min</span>.
            {moduleNumber !== null ? (
              <>
                {" "}
                Nesse ritmo, o Módulo {formatTwoDigits(moduleNumber)} termina{" "}
                <span className="font-medium text-texto">{formatDays(daysToFinish)}</span>.
              </>
            ) : null}
          </p>
          {error ? (
            <p role="alert" className="text-sm font-medium">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
