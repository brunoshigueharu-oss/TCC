"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { formatCompact, formatNumber, formatTwoDigits } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";

const formatters = {
  number: formatNumber,
  twoDigits: formatTwoDigits,
  compact: formatCompact,
} satisfies Record<string, (value: number) => string>;

type CountUpProps = {
  value: number;
  /** Como escrever o número (funções não atravessam do servidor para o cliente). */
  format?: keyof typeof formatters;
  /** Duração da contagem, em segundos. */
  duration?: number;
  className?: string;
};

/**
 * Número que conta de zero até o valor quando entra na tela. O HTML do
 * servidor já traz o valor final (sem JavaScript nada some); quem pede menos
 * movimento vê o número parado.
 */
export function CountUp({ value, format = "number", duration = 0.9, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const write = formatters[format];

  useEffect(() => {
    const element = ref.current;
    if (!element || !isInView || shouldReduceMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        element.textContent = write(Math.round(latest));
      },
    });
    return () => {
      controls.stop();
      element.textContent = write(value);
    };
  }, [isInView, shouldReduceMotion, value, duration, write]);

  return (
    <span ref={ref} className={className}>
      {write(value)}
    </span>
  );
}
