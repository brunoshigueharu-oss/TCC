"use client";

import { useEffect, useRef, useState } from "react";

import { GLYPH_CHANGE_CHANCE, GLYPH_TICK_MS, randomVariant, type GlyphState } from "@/lib/glyph-variants";
import { isLatestIntersecting } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/reduced-motion";
import { useIndexedRefs } from "./use-indexed-refs";

/**
 * Onda de troca: cada letra começa `staggerMs` depois da anterior e troca por
 * `letterMs`. Depois da última, a palavra descansa `restMs` na fonte certa:
 * o bastante para ser lida, sem parecer que a animação travou.
 */
const WAVE = { staggerMs: 75, letterMs: 640, restMs: 850 } as const;
/** Espera entre a palavra entrar na tela e a primeira onda. */
const FIRST_WAVE_DELAY_MS = 700;
/**
 * Ondas por vez que a palavra entra na tela. Duas cabem em menos de 5 s, o
 * limite da WCAG 2.2.2 para movimento automático sem botão de pausa; depois
 * a palavra fica parada e legível até sair e voltar à tela.
 */
const WAVES_PER_VIEW = 2;

/**
 * Embaralha as letras sozinho, sem depender do cursor: uma onda atravessa a
 * palavra da esquerda para a direita, duas vezes a cada entrada na tela. Só roda com a palavra na
 * tela e não roda para quem pede menos movimento.
 *
 * Ligar `containerRef` no elemento da palavra. Devolve o mesmo formato de
 * `useGlyphShuffle`; aqui ninguém precisa da posição das letras, mas
 * `registerLetter` existe para os dois servirem ao mesmo componente.
 */
export function useGlyphWave<T extends HTMLElement>(letterCount: number) {
  const containerRef = useRef<T>(null);
  const { refFor: registerLetter } = useIndexedRefs<HTMLElement>();
  const [glyphs, setGlyphs] = useState<GlyphState[]>(() => Array<GlyphState>(letterCount).fill(null));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    const waveMs = (letterCount - 1) * WAVE.staggerMs + WAVE.letterMs;
    const cycleMs = waveMs + WAVE.restMs;
    const runMs = (WAVES_PER_VIEW - 1) * cycleMs + waveMs;
    let interval: number | null = null;
    let startsAt = 0;
    let isResting = true;

    const rest = () => {
      if (isResting) return;
      isResting = true;
      setGlyphs(Array<GlyphState>(letterCount).fill(null));
    };

    const tick = () => {
      const elapsed = performance.now() - startsAt;
      if (elapsed >= runMs) {
        // As ondas desta entrada acabaram: o intervalo para, mas a palavra
        // continua "na tela" para o observador, que só recomeça na próxima entrada.
        if (interval !== null) window.clearInterval(interval);
        interval = null;
        rest();
        return;
      }
      const phase = elapsed % cycleMs;
      if (elapsed < 0 || phase >= waveMs) {
        rest();
        return;
      }
      isResting = false;
      setGlyphs((current) =>
        current.map((glyph, index) => {
          const letterStart = index * WAVE.staggerMs;
          const isActive = phase >= letterStart && phase < letterStart + WAVE.letterMs;
          if (!isActive) return null;
          return glyph === null || Math.random() < GLYPH_CHANGE_CHANCE ? randomVariant() : glyph;
        }),
      );
    };

    const stop = () => {
      if (interval !== null) window.clearInterval(interval);
      interval = null;
      rest();
    };

    const observer = new IntersectionObserver((entries) => {
      if (!isLatestIntersecting(entries)) {
        stop();
        return;
      }
      if (interval !== null) return;
      startsAt = performance.now() + FIRST_WAVE_DELAY_MS;
      interval = window.setInterval(tick, GLYPH_TICK_MS);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [letterCount]);

  return { glyphs, containerRef, registerLetter };
}
