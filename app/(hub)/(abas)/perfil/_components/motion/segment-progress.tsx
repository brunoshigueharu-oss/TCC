"use client";

import { motion, useReducedMotion } from "motion/react";

import { toneBg, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

export type SegmentState = "done" | "current" | "todo";

type SegmentProgressProps = {
  segments: SegmentState[];
  /** Texto lido por leitores de tela (ex.: "2 de 6 lições concluídas"). */
  label: string;
  /** Cor dos concluídos; `tinta` = cor do texto (lê bem nos dois temas). */
  tone?: Tone | "tinta";
  className?: string;
};

/**
 * Progresso em segmentos: um traço por lição. Os concluídos preenchem em
 * sequência ao entrar na tela; o atual fica pela metade. Padrão em tinta:
 * o limão da trilha some sobre o branco, então ele fica só no marcador.
 */
export function SegmentProgress({ segments, label, tone = "tinta", className }: SegmentProgressProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div role="img" aria-label={label} className={cn("flex gap-1", className)}>
      {segments.map((state, index) => (
        <span key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-superficie-forte">
          {state === "todo" ? null : (
            <motion.span
              className={cn(
                "block h-full w-full origin-left rounded-full",
                tone === "tinta" ? "bg-texto" : toneBg[tone],
              )}
              initial={shouldReduceMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: state === "done" ? 1 : 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.09, ease: EASE_OUT }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
