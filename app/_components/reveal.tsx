"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso (s), para escalonar itens de uma mesma lista. */
  delay?: number;
  className?: string;
};

/** Curva padrão do site (docs/direcao-visual.md). */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Entrada na rolagem: o bloco sobe 16px e aparece uma única vez, quando entra
 * na tela. Com `prefers-reduced-motion`, o motion corta o deslocamento e
 * mantém só o fade.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
