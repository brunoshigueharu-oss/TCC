"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Atraso (s), para escalonar itens de uma mesma lista. */
  delay?: number;
  className?: string;
};

/**
 * Entrada na rolagem: o bloco sobe 16px e aparece uma única vez, quando entra
 * na tela. O estado inicial (invisível) vem como estilo inline do servidor;
 * `data-reveal` deixa o `globals.css` mostrar o bloco já pronto para quem pede
 * menos movimento e quando o JavaScript não roda, para nenhum texto ficar
 * escondido esperando uma animação que não vai acontecer.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-reveal
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
