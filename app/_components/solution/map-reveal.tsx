"use client";

import { MotionConfig, motion } from "motion/react";
import { type ReactNode, useRef } from "react";

import { EASE_OUT } from "@/lib/motion";
import { SolutionShapes } from "./solution-shapes";

/**
 * Ordem da entrada do mapa, em segundos: a logo pousa, a bola gira até
 * parar, as linhas saem das letras e as etiquetas aparecem na ponta delas.
 */
export const MAP_TIMING = {
  logo: 0,
  ball: 0.15,
  lines: 0.5,
  pills: 0.75,
  stagger: 0.07,
} as const;

/** Mesmo gatilho para todas as peças: o mapa passou um pouco da borda de baixo. */
const VIEWPORT = { once: true, margin: "0px 0px -18% 0px" } as const;

type MapStageProps = {
  className?: string;
  children: ReactNode;
};

/** Caixa do mapa: mede a própria rolagem para as formas e libera o movimento reduzido. */
export function MapStage({ className, children }: MapStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={stageRef} className={className}>
        <SolutionShapes targetRef={stageRef} />
        {children}
      </div>
    </MotionConfig>
  );
}

/** A logo pousa: cresce um pouco e aparece. */
export function LogoReveal({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: MAP_TIMING.logo }}
    >
      {children}
    </motion.div>
  );
}

/** A bola 8 rola até o lugar dela, girando e freando. */
export function BallSpin({ children }: { children: ReactNode }) {
  return (
    <motion.span
      data-reveal
      className="inline-flex"
      initial={{ opacity: 0, x: "60%", rotate: 200 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: MAP_TIMING.ball }}
    >
      {children}
    </motion.span>
  );
}

type LineRevealProps = {
  line: { x1: number; y1: number; x2: number; y2: number };
  index: number;
};

/** Linha do mapa desenhada das letras para a etiqueta. */
export function LineReveal({ line, index }: LineRevealProps) {
  return (
    <motion.line
      x1={line.x2}
      y1={line.y2}
      x2={line.x1}
      y2={line.y1}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ x2: line.x2, y2: line.y2, opacity: 0 }}
      whileInView={{ x2: line.x1, y2: line.y1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: EASE_OUT, delay: MAP_TIMING.lines + index * MAP_TIMING.stagger }}
    />
  );
}

type PillRevealProps = {
  index: number;
  className?: string;
  children: ReactNode;
};

/** Etiqueta que aparece na ponta da linha, com um quique curto. */
export function PillReveal({ index, className, children }: PillRevealProps) {
  return (
    <motion.li
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
        delay: MAP_TIMING.pills + index * MAP_TIMING.stagger,
      }}
    >
      {children}
    </motion.li>
  );
}
