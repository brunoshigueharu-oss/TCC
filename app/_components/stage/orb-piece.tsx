"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import { useDeferredCanvas } from "@/hooks/use-deferred-canvas";
import { orbData } from "@/lib/data/orbe";
import { ORB_LAST_STAGE, ORB_STAGE_IDS } from "@/lib/orb/orb-timeline";
import { pointerToUnit } from "@/lib/pointer";
import { cn } from "@/lib/utils";
import { CanvasFrame } from "../canvas-frame";
import type { OrbStageControl } from "./orb-stage-canvas";

// three.js só entra no navegador, e só depois que o palco aparece.
const OrbStageCanvas = dynamic(() => import("./orb-stage-canvas").then((module) => module.OrbStageCanvas), {
  ssr: false,
});

/** Um objeto da sequência, como aparece na lista de nomes. */
export type OrbPieceStage = { id: string; name: string };

type OrbPieceProps = {
  /**
   * Nomes dos cinco objetos, na ordem de `ORB_STAGE_IDS`. Por enquanto é
   * opcional e cai em `orbData`, até a landing passar os dados por prop.
   */
  stages?: readonly OrbPieceStage[];
};

/** A peça abre na bola 8, o objeto que dá nome ao hub. */
const START_STAGE = ORB_STAGE_IDS.indexOf("bola-8");
/**
 * Pôster da bola 8 (o primeiro quadro do canvas, capturado do próprio palco,
 * sem fundo), mostrado enquanto o 3D carrega. Fica recortado no objeto; a
 * posição e o tamanho, em % da caixa do canvas, o põem exatamente sobre ele.
 */
const POSTER = {
  src: "/landing/pecas/orbe-poster.webp",
  width: 424,
  height: 426,
  /** Recorte medido na captura: canto e largura do objeto dentro da caixa (quadrada) do canvas. */
  placement: "left-[21.81%] top-[21.68%] w-[56.38%] h-auto",
  /** O objeto tem uns 210 px no palco. */
  sizes: "220px",
} as const;
/** Sem ninguém mexendo, a peça passa sozinha para o objeto vizinho a cada tanto (ms). */
const AUTOPLAY_MS = 4200;
/** Depois de um clique ou arrasto, a troca automática espera este tempo (ms). */
const PAUSE_AFTER_TOUCH_MS = 9000;
/**
 * Botões da lista de objetos: o visual tem 36px de altura, mas a área de toque
 * (o `before`) chega a 44px, o mínimo para o dedo.
 */
const chipClass =
  "relative flex min-h-9 items-center rounded-full text-xs font-medium outline-none transition-colors duration-200 before:absolute before:-inset-y-1 before:inset-x-0 focus-visible:ring-2 focus-visible:ring-texto";

/**
 * Peça do palco: os cinco objetos 3D de `lib/orb`, que viram um no outro.
 * Arrastar gira o objeto como uma bola na mão (com inércia; solto, ele volta
 * para a pose de repouso). Os nomes embaixo escolhem o objeto e, sem ninguém
 * mexendo, a peça percorre a sequência sozinha, indo e voltando, até alguém
 * pausar no botão ao lado dos nomes. O canvas só é carregado com o navegador
 * à toa e só desenha com a peça na tela; até ele ficar pronto, um pôster
 * estático da bola 8 ocupa o lugar do objeto.
 */
export function OrbPiece({ stages = orbData.stages }: OrbPieceProps) {
  const isReducedMotion = useReducedMotion();
  const { boxRef, isLoaded, isInView, isReady, handleReady } = useDeferredCanvas();
  const controlRef = useRef<OrbStageControl>({
    targetStage: START_STAGE,
    dragX: 0,
    dragY: 0,
    isDragging: false,
    leanX: 0,
    leanY: 0,
  });
  /** Último ponto do arrasto e, para a troca automática, o sentido e até quando ela espera. */
  const pointerRef = useRef({ x: 0, y: 0 });
  const autoplayRef = useRef({ direction: 1, waitsUntil: 0 });
  /** Objeto com o nome destacado na lista: o que está na tela (ou o que a pessoa acabou de escolher). */
  const [highlightedStage, setHighlightedStage] = useState(START_STAGE);
  /**
   * Objeto escolhido num clique, enquanto a transformação ainda não chegou
   * nele: os objetos do caminho não roubam o destaque.
   */
  const pickedStageRef = useRef<number | null>(null);
  /**
   * Objeto anunciado ao leitor de tela. Só muda quando a pessoa escolhe: a
   * troca automática não anuncia nada (seria uma fala a cada poucos segundos).
   */
  const [announcedStage, setAnnouncedStage] = useState(START_STAGE);
  /**
   * Pausa pedida pelo botão: a troca automática é movimento que dura mais de
   * 5 s, então precisa de um jeito de parar (WCAG 2.2.2).
   */
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const pauseAutoplay = useCallback(() => {
    autoplayRef.current.waitsUntil = performance.now() + PAUSE_AFTER_TOUCH_MS;
  }, []);

  // Troca automática: vai até a ponta da sequência e volta, um objeto por vez.
  useEffect(() => {
    if (isReducedMotion || isAutoplayPaused || !isInView || !isReady) return;
    const timer = window.setInterval(() => {
      const autoplay = autoplayRef.current;
      if (performance.now() < autoplay.waitsUntil) return;
      const control = controlRef.current;
      const current = control.targetStage;
      if (current + autoplay.direction > ORB_LAST_STAGE || current + autoplay.direction < 0) autoplay.direction *= -1;
      // O destaque não muda aqui: muda quando o objeto novo aparece (`handleStageShown`).
      pickedStageRef.current = null;
      control.targetStage = current + autoplay.direction;
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isAutoplayPaused, isInView, isReady, isReducedMotion]);

  const handlePick = (next: number) => {
    pauseAutoplay();
    controlRef.current.targetStage = next;
    pickedStageRef.current = next;
    setHighlightedStage(next);
    setAnnouncedStage(next);
  };

  const handleToggleAutoplay = () => setIsAutoplayPaused((isPaused) => !isPaused);

  /** O canvas avisa que a transformação passou da metade: o destaque vai para o objeto que está na tela. */
  const handleStageShown = useCallback((shown: number) => {
    const picked = pickedStageRef.current;
    if (picked !== null) {
      if (shown === picked) pickedStageRef.current = null;
      return;
    }
    setHighlightedStage(shown);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY };
    controlRef.current.isDragging = true;
    pauseAutoplay();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const control = controlRef.current;
    const lean = pointerToUnit(event, event.currentTarget);
    control.leanX = lean.x;
    control.leanY = lean.y;
    if (!control.isDragging) return;
    control.dragX += event.clientX - pointerRef.current.x;
    control.dragY += event.clientY - pointerRef.current.y;
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerEnd = () => {
    controlRef.current.isDragging = false;
  };

  const handlePointerLeave = () => {
    const control = controlRef.current;
    if (control.isDragging) return;
    control.leanX = 0;
    control.leanY = 0;
  };

  return (
    <div className="flex size-full flex-col items-center gap-2">
      <div
        ref={boxRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
        onPointerLeave={handlePointerLeave}
        className="relative aspect-square min-h-0 flex-1 cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        {/* Sombra de contato no "chão" do painel e o pôster, trocado pelo canvas quando ele fica pronto. */}
        <CanvasFrame
          isReady={isReady}
          shadowClassName="bottom-[14%] h-[6%] w-[44%] bg-tinta/30 blur-md"
          poster={
            <Image
              src={POSTER.src}
              alt=""
              width={POSTER.width}
              height={POSTER.height}
              sizes={POSTER.sizes}
              draggable={false}
              className={cn("absolute max-w-none select-none", POSTER.placement)}
            />
          }
        >
          {isLoaded ? (
            <OrbStageCanvas
              controlRef={controlRef}
              isActive={isInView}
              isAnimated={!isReducedMotion}
              onReady={handleReady}
              onStageShown={handleStageShown}
            />
          ) : null}
        </CanvasFrame>
        <p aria-live="polite" className="sr-only">
          Objeto em 3D: {stages[announcedStage].name}.
        </p>
      </div>

      <ul aria-label="Objetos" className="flex shrink-0 flex-wrap justify-center gap-1">
        {stages.map((orbStage, index) => {
          const isCurrent = index === highlightedStage;
          return (
            <li key={orbStage.id}>
              <button
                type="button"
                aria-pressed={isCurrent}
                onClick={() => handlePick(index)}
                className={cn(
                  chipClass,
                  "px-3",
                  isCurrent ? "bg-texto text-fundo" : "text-texto-secundario hover:bg-fundo hover:text-texto",
                )}
              >
                {orbStage.name}
              </button>
            </li>
          );
        })}
        {/*
          Sem troca automática (menos movimento), não há o que pausar. Some por
          CSS, e não por condição no React, para o HTML do servidor e o do
          navegador serem iguais na hidratação.
        */}
        <li className="motion-reduce:hidden">
          <button
            type="button"
            aria-label={isAutoplayPaused ? "Retomar a troca automática" : "Pausar a troca automática"}
            onClick={handleToggleAutoplay}
            className={cn(chipClass, "w-9 justify-center text-texto-secundario hover:bg-fundo hover:text-texto")}
          >
            {isAutoplayPaused ? (
              <Play aria-hidden className="size-3.5" strokeWidth={1.75} />
            ) : (
              <Pause aria-hidden className="size-3.5" strokeWidth={1.75} />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
