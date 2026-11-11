"use client";

import { motion, useReducedMotion } from "motion/react";

import { toneBg, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./count-up";

type FillLineProps = {
  value: number;
  max: number;
  /** Texto lido por leitores de tela. */
  label: string;
  /** Cor do preenchimento; `tinta` = a cor do texto (sóbrio, inverte no escuro). */
  tone?: Tone | "tinta";
  /** Atraso da entrada, em segundos (para escalonar linhas de uma lista). */
  delay?: number;
  className?: string;
};

/**
 * Linha de progresso de 3px que preenche da esquerda para a direita ao entrar
 * na tela. Versão fina e animada da `ProgressBar`.
 */
export function FillLine({ value, max, label, tone = "tinta", delay = 0, className }: FillLineProps) {
  const shouldReduceMotion = useReducedMotion();
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-[3px] w-full overflow-hidden rounded-full bg-superficie-forte", className)}
    >
      <motion.div
        className={cn("h-full w-full origin-left rounded-full", tone === "tinta" ? "bg-texto" : toneBg[tone])}
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: ratio }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT }}
      />
    </div>
  );
}
