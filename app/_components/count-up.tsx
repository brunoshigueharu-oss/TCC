"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type CountUpProps = {
  value: number;
  className?: string;
};

/**
 * Número que conta de 0 até o valor quando entra na tela. O HTML já sai com o
 * valor final (sem JS ou com menos movimento, é ele que aparece).
 */
export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !isInView || shouldReduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        element.textContent = String(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
