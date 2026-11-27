"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useRef, type PointerEvent } from "react";

import { useDeferredCanvas } from "@/hooks/use-deferred-canvas";
import type { InteractionHintText } from "@/lib/data/landing";
import { pointerToUnit } from "@/lib/pointer";
import { cn } from "@/lib/utils";
import { CanvasFrame } from "../canvas-frame";
import { InteractionHint } from "../interaction-hint";
import type { Base8Pointer } from "./base8-canvas";

// three.js só entra no navegador, e só quando a seção está chegando na tela.
const Base8Canvas = dynamic(() => import("./base8-canvas").then((module) => module.Base8Canvas), { ssr: false });

type Base8LettersProps = {
  hint: InteractionHintText;
  className?: string;
};

/** Distância da tela a partir da qual o 3D começa a ser carregado. */
const LOAD_MARGIN = "500px";

/** Antes de o canvas ficar pronto não há o que redesenhar. */
function skipInvalidate() {}

/**
 * BASE8 em letras 3D, cada uma de um material; passar o mouse por cima de uma
 * letra (ou tocar nela) troca do que ela é feita, e a palavra se inclina de
 * leve na direção do ponteiro. Enquanto o 3D não chega (ou se o navegador não
 * tiver WebGL), fica a palavra em tipografia, que também é o texto lido por
 * leitor de tela.
 */
export function Base8Letters({ hint, className }: Base8LettersProps) {
  const isReducedMotion = useReducedMotion();
  const pointerRef = useRef<Base8Pointer>({ x: 0, y: 0 });
  /** Pedido de redesenho do canvas, entregue quando ele fica pronto (o 3D só desenha sob demanda). */
  const invalidateRef = useRef<() => void>(skipInvalidate);
  const { boxRef, isLoaded, isReady, handleReady } = useDeferredCanvas({ loadMargin: LOAD_MARGIN });

  const handleCanvasReady = useCallback(
    (invalidate: () => void) => {
      invalidateRef.current = invalidate;
      handleReady();
    },
    [handleReady],
  );

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    pointerRef.current = pointerToUnit(event, event.currentTarget);
    invalidateRef.current();
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
    invalidateRef.current();
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <InteractionHint hint={hint} />
      <div
        ref={boxRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="@container relative aspect-[3.1/1] w-full touch-manipulation"
      >
        <p
          className={cn(
            "absolute inset-0 flex items-center justify-center font-display text-[27cqw] leading-none font-bold tracking-[-0.035em] transition-opacity duration-500 select-none",
            isReady ? "opacity-0" : "opacity-100",
          )}
        >
          BASE8
        </p>
        {/* Sombra de contato: as letras são vistas um pouco de cima, pousadas na página. */}
        <CanvasFrame
          isReady={isReady}
          shadowClassName="bottom-[9%] h-[9%] w-[84%] bg-tinta/20 blur-xl"
          fade="slow"
        >
          {isLoaded ? (
            <Base8Canvas pointerRef={pointerRef} isAnimated={!isReducedMotion} onReady={handleCanvasReady} />
          ) : null}
        </CanvasFrame>
      </div>
    </div>
  );
}
