"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { formatCompact, formatNumber, formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Formatos prontos — use estes quando o pai for Server Component (funções não atravessam). */
const presets = {
  milhar: formatNumber,
  "dois-digitos": formatTwoDigits,
  compacto: formatCompact,
} as const;

export type AnimatedNumberFormat = keyof typeof presets;

type AnimatedNumberProps = {
  value: number;
  /** Duração da contagem, em segundos. */
  duration?: number;
  /**
   * Formato: `"milhar"` (padrão, "1.240"), `"dois-digitos"` ("07"),
   * `"compacto"` ("1,2 mil") ou uma função (só a partir de Client Components).
   */
  format?: AnimatedNumberFormat | ((value: number) => string);
  className?: string;
};

/**
 * Número que conta até o valor quando entra na tela e quando o valor muda.
 * O HTML do servidor já traz o valor final (sem salto de layout e legível sem
 * JS); `tabular-nums` evita que a largura dance. Com `prefers-reduced-motion`
 * o número só troca.
 */
export function AnimatedNumber({ value, duration = 0.9, format: formatProp = "milhar", className }: AnimatedNumberProps) {
  const format = typeof formatProp === "function" ? formatProp : presets[formatProp];
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !isInView) return;

    if (shouldReduceMotion) {
      element.textContent = format(value);
      previous.current = value;
      return;
    }

    const controls = animate(previous.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        element.textContent = format(Math.round(latest));
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration, format, isInView, shouldReduceMotion]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
