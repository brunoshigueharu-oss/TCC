"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

import { clamp, smoothstep } from "@/lib/math";
import { useIndexedRefs } from "./use-indexed-refs";
import { useSettlingLoop } from "./use-settling-loop";

/** Movimento mínimo (px) para o gesto deixar de ser um clique. */
const CLICK_TOLERANCE_PX = 5;
/** Rigidez da mola que leva a faixa até o destino (maior = mais rápido). */
const SPRING_STIFFNESS = 9;
/** Quanto a velocidade do arrasto empurra o destino ao soltar (em segundos). */
const FLING_FACTOR = 0.18;
/** Tempo sem eventos de roda (ms) para encaixar no item mais próximo. */
const WHEEL_SETTLE_MS = 140;
/** Distância (em itens) abaixo da qual a mola chega ao destino. */
const ARRIVAL_EPSILON = 0.0005;
/** Média móvel da velocidade do arrasto: peso da leitura anterior e da nova. */
const VELOCITY_SMOOTHING = { previous: 0.6, current: 0.4 } as const;
/** Parado por mais que isto (ms) antes de soltar: o arrasto não arremessa. */
const FLING_IDLE_MS = 80;

/**
 * Arrumação em pilha: as vizinhas ficam meio atrás da peça do centro, como
 * cartas num leque.
 */
const STACK = {
  /** Passo da primeira vizinha, em larguras da peça: 0,5 = fica metade atrás da do centro. */
  firstStep: 0.5,
  /** Passo de cada vizinha seguinte: quase toda atrás da anterior. */
  nextStep: 0.14,
  /** Quanto a peça encolhe a cada posição longe do centro. */
  shrink: 0.18,
  /** Giro das vizinhas em volta do próprio eixo vertical, em graus. */
  turn: 10,
  /** Escurecimento das vizinhas (0 a 1), publicado em `--dim` para a peça usar. */
  dim: 0.5,
  /** Entre estas distâncias (em posições) a peça some atrás da pilha: só uma vizinha aparece de cada lado. */
  fadeFrom: 1.05,
  fadeTo: 1.7,
  /** Distância do observador, em px: dá a profundidade do giro. */
  perspective: 1400,
  /** Camada da peça do centro; cada posição longe dele desce `zStep`. Fica contida no trilho (`isolate`). */
  zTop: 100,
  zStep: 10,
} as const;

type UseStackCarouselOptions = {
  count: number;
  initialIndex: number;
};

/**
 * Se o evento aconteceu dentro do trilho no DOM. Eventos de portais (o painel
 * aberto de uma tela) sobem pela árvore do React até o trilho sem estarem nele.
 */
export function isInsideTrack(event: { target: EventTarget; currentTarget: EventTarget }) {
  const { target, currentTarget } = event;
  return target instanceof Node && currentTarget instanceof Node && currentTarget.contains(target);
}

/** Diferença circular de `value` para dentro de [-count/2, count/2). */
function wrapOffset(value: number, count: number) {
  return ((((value + count / 2) % count) + count) % count) - count / 2;
}

/**
 * Carrossel sem fim em pilha: a peça do centro na frente e as vizinhas meio
 * atrás dela, como cartas num leque. A posição é um número contínuo (em itens)
 * e cada peça é posicionada por `transform` a partir da distância dela até o
 * centro, dando a volta pela lista. Assim não há ponta para "travar".
 *
 * A cada frame a posição corre atrás do destino com uma mola, e escala,
 * opacidade e deslocamento são escritos direto no DOM (sem re-render).
 *
 * Cada peça precisa de `itemRef(index)`; o trilho recebe `trackRef` e `handlers`
 * e deve ter `isolate`, para as camadas das peças não passarem por cima do resto
 * da página.
 */
export function useStackCarousel({ count, initialIndex }: UseStackCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { elementsRef: itemsRef, refFor: itemRef } = useIndexedRefs<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef(initialIndex);
  const targetRef = useRef(initialIndex);
  const slotRef = useRef(0);
  const activeRef = useRef(initialIndex);
  /** Tira os ouvintes do arrasto em andamento (também se o carrossel sair da página no meio dele). */
  const detachDragRef = useRef<(() => void) | null>(null);
  const dragRef = useRef({
    isActive: false,
    hasMoved: false,
    startX: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  /** Largura da peça, em px: base dos deslocamentos. */
  const measure = useCallback(() => {
    const first = itemsRef.current[0];
    if (first) slotRef.current = first.offsetWidth;
  }, [itemsRef]);

  /** Quantos px de arrasto ou de roda andam um item: a vizinha está a `firstStep` peças do centro. */
  const pixelsPerStep = useCallback(() => slotRef.current * STACK.firstStep, []);

  /** Escreve transform/opacidade de cada peça para a posição atual. */
  const render = useCallback(() => {
    const slot = slotRef.current;
    const position = positionRef.current;
    itemsRef.current.forEach((item, index) => {
      if (!item) return;
      const offset = wrapOffset(index - position, count);
      const distance = Math.abs(offset);
      // Suaviza a curva para a saída do centro acelerar e frear sem quina.
      const eased = smoothstep(0, 1, 1 - distance);

      const side = Math.sign(offset);
      // Quanto a peça já saiu do centro (0 = no centro, 1 = primeira vizinha ou além).
      const away = 1 - eased;
      const beyond = Math.max(0, distance - 1);
      const shift = side * slot * (STACK.firstStep * away + STACK.nextStep * beyond);
      const scale = 1 - STACK.shrink * (away + Math.min(beyond, 1));
      const hidden = clamp((distance - STACK.fadeFrom) / (STACK.fadeTo - STACK.fadeFrom), 0, 1);
      item.style.transform = `perspective(${STACK.perspective}px) translate3d(${shift}px, 0, 0) rotateY(${-side * STACK.turn * away}deg) scale(${scale})`;
      item.style.opacity = String(1 - hidden);
      // Escondida atrás da pilha, a peça não pode receber o clique de quem mira na vizinha.
      item.style.pointerEvents = hidden >= 1 ? "none" : "";
      item.style.zIndex = String(STACK.zTop - Math.round(distance * STACK.zStep));
      item.style.setProperty("--dim", String(STACK.dim * away));
    });
    const nearest = ((Math.round(position) % count) + count) % count;
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActiveIndex(nearest);
    }
  }, [count, itemsRef]);

  /** Laço de animação: roda enquanto há arrasto ou a posição não chegou ao destino. */
  const loop = useSettlingLoop((deltaSeconds) => {
    if (!dragRef.current.isActive) {
      const distance = targetRef.current - positionRef.current;
      // Fator independente da taxa de quadros (60 Hz ou 120 Hz andam igual).
      positionRef.current += distance * (1 - Math.exp(-SPRING_STIFFNESS * deltaSeconds));
      if (Math.abs(distance) < ARRIVAL_EPSILON) positionRef.current = targetRef.current;
    }
    render();
    return dragRef.current.isActive || positionRef.current !== targetRef.current;
  });
  const startLoop = loop.start;

  const goTo = useCallback(
    (target: number) => {
      targetRef.current = target;
      startLoop();
    },
    [startLoop],
  );

  /** Avança ou volta `step` itens a partir do destino atual. */
  const scrollByStep = useCallback((step: number) => goTo(Math.round(targetRef.current) + step), [goTo]);

  /** Vai até a peça `index` pelo caminho mais curto. */
  const scrollToIndex = useCallback(
    (index: number) => goTo(Math.round(targetRef.current + wrapOffset(index - targetRef.current, count))),
    [count, goTo],
  );

  // Mede, desenha a posição inicial e remede quando o tamanho muda.
  // Antes da pintura, para as peças não aparecerem empilhadas no primeiro frame.
  useLayoutEffect(() => {
    measure();
    render();
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      measure();
      render();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, render]);

  useEffect(() => () => detachDragRef.current?.(), []);

  // Trackpad/roda horizontal: segue o gesto e encaixa quando ele para.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const handleWheel = (event: WheelEvent) => {
      const slot = pixelsPerStep();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.shiftKey ? event.deltaY : 0;
      if (!slot || delta === 0) return;
      event.preventDefault();
      goTo(targetRef.current + delta / slot);
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => goTo(Math.round(targetRef.current)), WHEEL_SETTLE_MS);
    };
    track.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      clearTimeout(settleTimer);
      track.removeEventListener("wheel", handleWheel);
    };
  }, [goTo, pixelsPerStep]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      // O painel aberto de uma tela é um portal: os eventos dele sobem pela árvore do React até aqui.
      if (!isInsideTrack(event)) return;
      const now = performance.now();
      dragRef.current = {
        isActive: true,
        hasMoved: false,
        startX: event.clientX,
        startPosition: positionRef.current,
        lastX: event.clientX,
        lastTime: now,
        velocity: 0,
      };
      setIsDragging(true);
      startLoop();

      const handleMove = (moveEvent: globalThis.PointerEvent) => {
        const drag = dragRef.current;
        const slot = pixelsPerStep() || 1;
        const deltaX = moveEvent.clientX - drag.startX;
        if (Math.abs(deltaX) > CLICK_TOLERANCE_PX) drag.hasMoved = true;
        positionRef.current = drag.startPosition - deltaX / slot;
        targetRef.current = positionRef.current;
        const moveTime = performance.now();
        const elapsed = Math.max(1, moveTime - drag.lastTime);
        // Média móvel da velocidade (itens por segundo) para o arremesso.
        const instant = (-(moveEvent.clientX - drag.lastX) / slot) * (1000 / elapsed);
        drag.velocity = drag.velocity * VELOCITY_SMOOTHING.previous + instant * VELOCITY_SMOOTHING.current;
        drag.lastX = moveEvent.clientX;
        drag.lastTime = moveTime;
      };

      const detach = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        detachDragRef.current = null;
      };

      function handleUp() {
        detach();
        const drag = dragRef.current;
        drag.isActive = false;
        setIsDragging(false);
        // Parado há um tempo antes de soltar: sem arremesso.
        const velocity = performance.now() - drag.lastTime > FLING_IDLE_MS ? 0 : drag.velocity;
        goTo(Math.round(positionRef.current + velocity * FLING_FACTOR));
      }

      detachDragRef.current?.();
      detachDragRef.current = detach;
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [goTo, pixelsPerStep, startLoop],
  );

  /** Depois de um arrasto, o clique que sobra não deve acionar nada. */
  const handleClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (isInsideTrack(event) && dragRef.current.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.hasMoved = false;
    }
  }, []);

  return {
    trackRef,
    itemRef,
    activeIndex,
    isDragging,
    scrollToIndex,
    scrollByStep,
    handlers: { onPointerDown: handlePointerDown, onClickCapture: handleClickCapture },
  };
}
