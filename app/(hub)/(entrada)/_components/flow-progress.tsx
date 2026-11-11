"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/** Etapas do primeiro acesso, depois de criar a conta. */
export const FLOW_STAGES = ["Perfil", "Seus dados", "Nivelamento"] as const;
export type FlowStage = (typeof FLOW_STAGES)[number];

type FlowProgressProps = {
  stage: FlowStage;
  /** Passo dentro da etapa (ex.: pergunta 2 de 8). */
  step?: number;
  steps?: number;
};

/**
 * Indicador de etapas sóbrio: três filetes finos, o atual enche conforme o
 * passo; à direita, onde a pessoa está em mono ("Perfil · 02 / 03").
 */
export function FlowProgress({ stage, step = 1, steps = 1 }: FlowProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const current = FLOW_STAGES.indexOf(stage);
  const fraction = Math.min(step / steps, 1);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
          Etapa {current + 1} de {FLOW_STAGES.length}
          <span className="sr-only">: {stage}</span>
        </p>
        {steps > 1 ? (
          <p className="font-mono text-[11px] text-texto-secundario tabular-nums">
            <span className="sr-only">passo </span>
            {String(step).padStart(2, "0")} / {String(steps).padStart(2, "0")}
          </p>
        ) : null}
      </div>
      <ol aria-label="Etapas do primeiro acesso" className="grid grid-cols-3 gap-1.5">
        {FLOW_STAGES.map((label, index) => (
          <li key={label} aria-current={index === current ? "step" : undefined} className="flex flex-col gap-1.5">
            <span className="relative block h-0.5 overflow-hidden rounded-full bg-linha">
              <motion.span
                aria-hidden
                className={cn("absolute inset-0 origin-left rounded-full bg-texto")}
                initial={false}
                animate={{ scaleX: index < current ? 1 : index === current ? fraction : 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
            <span
              className={cn(
                "hidden text-[11px] sm:block",
                index === current ? "font-semibold text-texto" : "text-texto-secundario",
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
