"use client";

import { useCallback, useEffect, useRef, type PointerEvent } from "react";

import { clamp } from "@/lib/math";
import { prefersReducedMotion } from "@/lib/reduced-motion";
import { useIndexedRefs } from "./use-indexed-refs";
import { useSettlingLoop } from "./use-settling-loop";

/** Balanço em volta do pino: mola de volta ao repouso, atrito e força do vento (graus/s²). */
const SWAY = { stiffness: 70, damping: 4.2, windForce: 700 } as const;
/** Barra do papel levantando (0 a 1): mola até a força da rajada e atrito. */
const LIFT = { stiffness: 120, damping: 14 } as const;
/** Velocidade do ponteiro (px/s) que conta como vento cheio. */
const FULL_WIND_SPEED = 1400;
/** Tempo (s) para a rajada perder ~63% da força depois que o ponteiro passa. */
const WIND_FADE_SECONDS = 0.14;
/** Alcance do vento em volta do centro do papel, em larguras do papel. */
const REACH = 0.95;
/** Pausa do ponteiro (ms) a partir da qual o movimento seguinte não é rajada. */
const POINTER_IDLE_MS = 120;
/** Abaixo disto o papel é dado como parado e o laço desliga. */
const REST = { angle: 0.02, velocity: 0.05, lift: 0.004, wind: 0.01 } as const;
/** Rajada de apresentação, quando a fileira entra na tela. */
const WELCOME = { wind: 0.55, gust: 0.6, staggerMs: 140, visibleRatio: 0.35 } as const;
/** Rajada do toque (sem ponteiro que passe por cima). */
const TAP = { wind: 0.8, gust: 0.9 } as const;

type NoteState = {
  /** Inclinação do papel parado, lida da classe (`rotate`). */
  restAngle: number;
  /** Desvio do repouso, em graus, e a velocidade dele. */
  angle: number;
  velocity: number;
  /** Quanto a barra do papel levantou (0 a 1) e a velocidade disso. */
  lift: number;
  liftVelocity: number;
  /** Vento de lado (-1 a 1) e força da rajada (0 a 1); os dois vão morrendo. */
  wind: number;
  gust: number;
};

type PointerSample = { x: number; y: number; time: number };

function createState(element: HTMLElement): NoteState {
  const restAngle = Number.parseFloat(window.getComputedStyle(element).rotate) || 0;
  return { restAngle, angle: 0, velocity: 0, lift: 0, liftVelocity: 0, wind: 0, gust: 0 };
}

function isAtRest(state: NoteState) {
  return (
    Math.abs(state.angle) < REST.angle &&
    Math.abs(state.velocity) < REST.velocity &&
    Math.abs(state.lift) < REST.lift &&
    Math.abs(state.wind) < REST.wind &&
    state.gust < REST.wind
  );
}

/**
 * Faz os papéis presos por um pino balançarem como se passasse um vento: o
 * movimento do ponteiro sobre a fileira empurra cada papel para o lado e
 * levanta a barra dele, e uma mola amortecida traz de volta.
 *
 * O giro é escrito direto no DOM (`rotate`) e o levantar vai na variável CSS
 * `--lift` (0 a 1), que as classes do papel leem. Parado, o papel volta a
 * valer só pelas classes. Quem pede menos movimento não recebe nada disso.
 *
 * Ligar `containerRef` e `handlers` na fileira e `noteRef(index)` em cada papel.
 */
export function usePaperBreeze<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const statesRef = useRef<(NoteState | undefined)[]>([]);
  // Um callback fixo por papel: religar o elemento a cada render zeraria o balanço no meio.
  const { elementsRef: notesRef, refFor: noteRef } = useIndexedRefs<HTMLElement>((index, element) => {
    if (!element) {
      statesRef.current[index] = undefined;
      return;
    }
    // O repouso é lido da classe: tira qualquer giro escrito por uma animação anterior.
    element.style.rotate = "";
    statesRef.current[index] = createState(element);
  });
  const pointerRef = useRef<PointerSample | null>(null);
  /** Laço da simulação: roda enquanto algum papel ainda se mexe. */
  const loop = useSettlingLoop((delta) => {
    const fade = Math.exp(-delta / WIND_FADE_SECONDS);
    let isMoving = false;

    notesRef.current.forEach((note, index) => {
      const state = statesRef.current[index];
      if (!note || !state) return;

      const acceleration = state.wind * SWAY.windForce - SWAY.stiffness * state.angle - SWAY.damping * state.velocity;
      state.velocity += acceleration * delta;
      state.angle += state.velocity * delta;

      const liftAcceleration = LIFT.stiffness * (state.gust - state.lift) - LIFT.damping * state.liftVelocity;
      state.liftVelocity += liftAcceleration * delta;
      state.lift += state.liftVelocity * delta;

      state.wind *= fade;
      state.gust *= fade;

      if (isAtRest(state)) {
        Object.assign(state, { angle: 0, velocity: 0, lift: 0, liftVelocity: 0, wind: 0, gust: 0 });
        note.style.rotate = "";
        note.style.removeProperty("--lift");
        return;
      }
      isMoving = true;
      note.style.rotate = `${(state.restAngle + state.angle).toFixed(3)}deg`;
      note.style.setProperty("--lift", state.lift.toFixed(3));
    });

    return isMoving;
  });

  /** Sopra um papel: fica valendo a rajada mais forte entre a que já soprava e a nova. */
  const blow = useCallback(
    (index: number, wind: number, gust: number) => {
      const state = statesRef.current[index];
      if (!state) return;
      if (Math.abs(wind) > Math.abs(state.wind)) state.wind = wind;
      if (gust > state.gust) state.gust = gust;
      loop.start();
    },
    [loop],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
      const now = performance.now();
      const last = pointerRef.current;
      pointerRef.current = { x: event.clientX, y: event.clientY, time: now };
      if (!last) return;

      const elapsed = now - last.time;
      if (elapsed <= 0 || elapsed > POINTER_IDLE_MS) return;
      const speedX = ((event.clientX - last.x) / elapsed) * 1000;
      const speedY = ((event.clientY - last.y) / elapsed) * 1000;
      const sideways = clamp(speedX / FULL_WIND_SPEED, -1, 1);
      const strength = clamp(Math.hypot(speedX, speedY) / FULL_WIND_SPEED, 0, 1);

      notesRef.current.forEach((note, index) => {
        if (!note) return;
        const rect = note.getBoundingClientRect();
        const distance = Math.hypot(
          rect.left + rect.width / 2 - event.clientX,
          rect.top + rect.height / 2 - event.clientY,
        );
        const closeness = Math.max(0, 1 - distance / (rect.width * REACH));
        if (closeness > 0) blow(index, sideways * closeness, strength * closeness);
      });
    },
    [blow, notesRef],
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = null;
  }, []);

  /** No toque não há ponteiro passando: o papel tocado leva uma rajada. */
  const handlePointerDown = useCallback(
    (event: PointerEvent<T>) => {
      const { target } = event;
      if (event.pointerType === "mouse" || prefersReducedMotion() || !(target instanceof Node)) return;
      const index = notesRef.current.findIndex((note) => note?.contains(target));
      if (index >= 0) blow(index, index % 2 === 0 ? TAP.wind : -TAP.wind, TAP.gust);
    },
    [blow, notesRef],
  );

  // Rajada de apresentação: uma vez, quando a fileira aparece, um papel depois do outro.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;
    const timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        notesRef.current.forEach((_, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          timers.push(
            window.setTimeout(() => blow(index, WELCOME.wind * direction, WELCOME.gust), index * WELCOME.staggerMs),
          );
        });
      },
      { threshold: WELCOME.visibleRatio },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [blow, notesRef]);

  return {
    containerRef,
    noteRef,
    handlers: {
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
    },
  };
}
