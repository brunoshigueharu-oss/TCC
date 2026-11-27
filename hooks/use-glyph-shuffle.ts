"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { GLYPH_CHANGE_CHANCE, GLYPH_TICK_MS, randomVariant, type GlyphState } from "@/lib/glyph-variants";
import { isLatestIntersecting } from "@/lib/motion";
import { useIndexedRefs } from "./use-indexed-refs";

/** Raio de alcance do cursor, em múltiplos do tamanho da fonte do título. */
const RADIUS_EM = 1.1;
/** Na borda do raio, a chance de troca (`GLYPH_CHANGE_CHANCE`) cai para esta fração — o efeito "esfarela" nas pontas. */
const EDGE_CHANCE_FACTOR = 0.3;
/** Depois que o cursor se afasta, a letra ainda troca por este tempo antes de voltar. */
const SETTLE_MIN_MS = 140;
/** Variação aleatória somada a esse tempo, para a volta não ficar mecânica. */
const SETTLE_JITTER_MS = 220;

type Point = { x: number; y: number };

/** Folga em volta da tela para começar a ouvir o cursor antes de o título aparecer. */
const LISTEN_MARGIN = "200px 0px";

/** 0 fora do raio; de 0 a 1 dentro dele (1 = cursor no centro da letra). */
function closenessTo(element: HTMLElement, pointer: Point, radius: number) {
  const rect = element.getBoundingClientRect();
  const distance = Math.hypot(rect.left + rect.width / 2 - pointer.x, rect.top + rect.height / 2 - pointer.y);
  return Math.max(0, 1 - distance / radius);
}

/**
 * Embaralha entre fontes e formas as letras que estão dentro de um raio em
 * volta do cursor — quanto mais perto, mais elas trocam. Quando o cursor se
 * afasta, cada letra ainda pisca um pouco e volta à fonte certa.
 *
 * Ligar `containerRef` no elemento do título e `registerLetter(i)` em cada
 * letra, com `i` contando o título inteiro (não por palavra).
 */
export function useGlyphShuffle<T extends HTMLElement>(letterCount: number) {
  const isReducedMotion = useReducedMotion();
  const containerRef = useRef<T>(null);
  const { elementsRef: lettersRef, refFor: registerLetter } = useIndexedRefs<HTMLElement>();
  const [glyphs, setGlyphs] = useState<GlyphState[]>(() => Array<GlyphState>(letterCount).fill(null));
  /** Cópia síncrona do estado, lida a cada tique. */
  const glyphsRef = useRef<GlyphState[]>(glyphs);
  const pointerRef = useRef<Point | null>(null);
  /** Momento em que o cursor deixou de alcançar cada letra + o tempo dela para voltar. */
  const settleAtRef = useRef<number[]>(Array<number>(letterCount).fill(0));
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getRadius = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    return Number.parseFloat(window.getComputedStyle(container).fontSize) * RADIUS_EM;
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const pointer = pointerRef.current;
    const radius = getRadius();
    let isPointerNear = false;
    let hasChanged = false;

    const next = glyphsRef.current.map((glyph, index) => {
      const letter = lettersRef.current[index];
      const closeness = pointer && letter ? closenessTo(letter, pointer, radius) : 0;

      if (closeness > 0) {
        isPointerNear = true;
        settleAtRef.current[index] = now + SETTLE_MIN_MS + Math.random() * SETTLE_JITTER_MS;
        const chance = GLYPH_CHANGE_CHANCE * (EDGE_CHANCE_FACTOR + (1 - EDGE_CHANCE_FACTOR) * closeness);
        if (Math.random() > chance) return glyph;
        hasChanged = true;
        return randomVariant();
      }

      if (glyph === null) return null;
      hasChanged = true;
      if (now >= settleAtRef.current[index]) return null;
      return Math.random() < GLYPH_CHANGE_CHANCE ? randomVariant() : glyph;
    });

    if (hasChanged) {
      glyphsRef.current = next;
      setGlyphs(next);
    }
    if (!isPointerNear && next.every((glyph) => glyph === null)) stop();
  }, [getRadius, lettersRef, stop]);

  const start = useCallback(() => {
    if (intervalRef.current === null) intervalRef.current = window.setInterval(tick, GLYPH_TICK_MS);
  }, [tick]);

  /*
   * O cursor é ouvido no documento todo: o raio passa da borda do título, e
   * as letras trocadas por outros elementos no meio da animação fariam
   * eventos presos ao título se perderem. Para a página não ter um ouvinte
   * por título a cada movimento do mouse, cada um só ouve enquanto o título
   * está perto da tela. Quem pede menos movimento não liga nada.
   */
  useEffect(() => {
    const root = document.documentElement;
    const container = containerRef.current;
    if (!container || isReducedMotion) return;

    function handlePointerMove(event: PointerEvent) {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (!container || intervalRef.current !== null) return;
      // Só liga o relógio quando o cursor chega perto do título.
      const rect = container.getBoundingClientRect();
      const radius = getRadius();
      const isNear =
        event.clientX > rect.left - radius &&
        event.clientX < rect.right + radius &&
        event.clientY > rect.top - radius &&
        event.clientY < rect.bottom + radius;
      if (isNear) start();
    }

    function handlePointerGone() {
      pointerRef.current = null;
    }

    /** No toque, o "cursor" some quando o dedo sai da tela. */
    function handlePointerUp(event: PointerEvent) {
      if (event.pointerType !== "mouse") handlePointerGone();
    }

    let isListening = false;
    const listen = (shouldListen: boolean) => {
      if (shouldListen === isListening) return;
      isListening = shouldListen;
      if (shouldListen) {
        root.addEventListener("pointermove", handlePointerMove);
        root.addEventListener("pointerleave", handlePointerGone);
        root.addEventListener("pointerup", handlePointerUp);
        return;
      }
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerGone);
      root.removeEventListener("pointerup", handlePointerUp);
      handlePointerGone();
    };

    const observer = new IntersectionObserver((entries) => listen(isLatestIntersecting(entries)), {
      rootMargin: LISTEN_MARGIN,
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      listen(false);
      stop();
    };
  }, [getRadius, isReducedMotion, start, stop]);

  return { glyphs, containerRef, registerLetter };
}
