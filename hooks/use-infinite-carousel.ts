"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";

/** Movimento mínimo (px) para o gesto deixar de ser um clique. */
const CLICK_TOLERANCE_PX = 5;
/** Quanto a peça do centro cresce (0.08 = 8% maior). */
const ACTIVE_SCALE_BOOST = 0.08;
/** Peças laterais ficam um pouco apagadas. */
const INACTIVE_OPACITY = 0.55;
/** Rigidez da mola que leva a faixa até o destino (maior = mais rápido). */
const SPRING_STIFFNESS = 9;
/** Quanto a velocidade do arrasto empurra o destino ao soltar (em segundos). */
const FLING_FACTOR = 0.18;
/** Tempo sem eventos de roda (ms) para encaixar no item mais próximo. */
const WHEEL_SETTLE_MS = 140;

type UseInfiniteCarouselOptions = {
  count: number;
  initialIndex: number;
  /** Espaço entre as peças, em px (somado à largura medida da peça). */
  gap: number;
};

/** Diferença circular de `value` para dentro de [-count/2, count/2). */
function wrapOffset(value: number, count: number) {
  return ((((value + count / 2) % count) + count) % count) - count / 2;
}

/**
 * Carrossel horizontal sem fim. A posição é um número contínuo (em itens) e
 * cada peça é posicionada por `transform` a partir da distância dela até o
 * centro, dando a volta pela lista. Assim não há ponta para "travar".
 *
 * A cada frame a posição corre atrás do destino com uma mola, e escala,
 * opacidade e deslocamento são escritos direto no DOM (sem re-render), o que
 * mantém o crescimento da peça do centro contínuo e suave.
 *
 * Cada peça precisa de `itemRef(index)`; o trilho recebe `trackRef` e `handlers`.
 */
export function useInfiniteCarousel({ count, initialIndex, gap }: UseInfiniteCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef(initialIndex);
  const targetRef = useRef(initialIndex);
  const slotRef = useRef(0);
  const activeRef = useRef(initialIndex);
  const frameRef = useRef(0);
  const dragRef = useRef({
    isActive: false,
    hasMoved: false,
    startX: 0,
    startPosition: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const measure = useCallback(() => {
    const first = itemRefs.current[0];
    if (first) slotRef.current = first.offsetWidth + gap;
  }, [gap]);

  /** Escreve transform/opacidade de cada peça para a posição atual. */
  const render = useCallback(() => {
    const slot = slotRef.current;
    const position = positionRef.current;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const offset = wrapOffset(index - position, count);
      const closeness = Math.max(0, 1 - Math.abs(offset));
      // Suaviza a curva para o crescimento acelerar e frear sem quina.
      const eased = closeness * closeness * (3 - 2 * closeness);
      const scale = 1 + ACTIVE_SCALE_BOOST * eased;
      const opacity = INACTIVE_OPACITY + (1 - INACTIVE_OPACITY) * eased;
      item.style.transform = `translate3d(${offset * slot}px, 0, 0) scale(${scale})`;
      item.style.opacity = String(opacity);
      item.style.zIndex = String(Math.round(eased * 10));
    });
    const nearest = ((Math.round(position) % count) + count) % count;
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActiveIndex(nearest);
    }
  }, [count]);

  /** Laço de animação: roda enquanto a posição não chegou ao destino. */
  const startLoop = useCallback(() => {
    if (frameRef.current) return;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const deltaSeconds = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!dragRef.current.isActive) {
        const distance = targetRef.current - positionRef.current;
        // Fator independente da taxa de quadros (60 Hz ou 120 Hz andam igual).
        positionRef.current += distance * (1 - Math.exp(-SPRING_STIFFNESS * deltaSeconds));
        if (Math.abs(distance) < 0.0005) positionRef.current = targetRef.current;
      }
      render();
      if (dragRef.current.isActive || positionRef.current !== targetRef.current) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = 0;
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [render]);

  const goTo = useCallback(
    (target: number) => {
      targetRef.current = target;
      startLoop();
    },
    [startLoop],
  );

  /** Avança ou volta `step` itens a partir do destino atual. */
  const scrollByStep = useCallback(
    (step: number) => goTo(Math.round(targetRef.current) + step),
    [goTo],
  );

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
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [measure, render]);

  // Trackpad/roda horizontal: segue o gesto e encaixa quando ele para.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const handleWheel = (event: WheelEvent) => {
      const slot = slotRef.current;
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
  }, [goTo]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
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
        const slot = slotRef.current || 1;
        const deltaX = moveEvent.clientX - drag.startX;
        if (Math.abs(deltaX) > CLICK_TOLERANCE_PX) drag.hasMoved = true;
        positionRef.current = drag.startPosition - deltaX / slot;
        targetRef.current = positionRef.current;
        const moveTime = performance.now();
        const elapsed = Math.max(1, moveTime - drag.lastTime);
        // Média móvel da velocidade (itens por segundo) para o arremesso.
        const instant = (-(moveEvent.clientX - drag.lastX) / slot) * (1000 / elapsed);
        drag.velocity = drag.velocity * 0.6 + instant * 0.4;
        drag.lastX = moveEvent.clientX;
        drag.lastTime = moveTime;
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
        const drag = dragRef.current;
        drag.isActive = false;
        setIsDragging(false);
        // Parado há um tempo antes de soltar: sem arremesso.
        const velocity = performance.now() - drag.lastTime > 80 ? 0 : drag.velocity;
        goTo(Math.round(positionRef.current + velocity * FLING_FACTOR));
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
    },
    [goTo, startLoop],
  );

  /** Depois de um arrasto, o clique que sobra não deve acionar nada. */
  const handleClickCapture = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.hasMoved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.hasMoved = false;
    }
  }, []);

  const itemRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      itemRefs.current[index] = element;
    },
    [],
  );

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
