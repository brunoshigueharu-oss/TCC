"use client";

import type { PointerEvent } from "react";

import { collageArt } from "@/lib/collage-art";
import { cn } from "@/lib/utils";
import { CollageImage } from "../collage-image";

type CollageLampProps = {
  /** Posição, tamanho e inclinação da lâmpada. */
  className?: string;
  /** Atraso e duração do pisca-pisca (classes literais), para as lâmpadas não piscarem juntas. */
  flickerClass?: string;
};

/** Pisca sozinha enquanto ninguém firmou a luz; acesa de vez, roda o `lamp-on`. */
const flickerLayerClass =
  "animate-lamp-flicker motion-reduce:animate-none group-data-[lit=true]:animate-lamp-on group-data-[lit=true]:opacity-100 group-data-[lit=true]:[animation-delay:0s] group-data-[lit=true]:[animation-duration:0.5s]";

/**
 * Lâmpada de colagem, vista de cima como um objeto pousado na mesa. Pisca
 * sozinha, num ciclo irregular (`animate-lamp-flicker`; `flickerClass`
 * desencontra as lâmpadas). Com o mouse em cima, firma acesa (pisca duas
 * vezes antes) e volta a piscar quando ele sai; no toque, cada toque firma ou
 * solta. Com movimento reduzido, fica apagada até a pessoa acender.
 * São duas imagens no mesmo enquadramento, a apagada por baixo e a acesa por
 * cima, mais um clarão desfocado atrás do vidro. Decorativa (aria-hidden).
 */
export function CollageLamp({ className, flickerClass }: CollageLampProps) {
  const setLit = (lamp: HTMLDivElement, isLit: boolean) => {
    lamp.dataset.lit = String(isLit);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setLit(event.currentTarget, true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setLit(event.currentTarget, false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") setLit(event.currentTarget, event.currentTarget.dataset.lit !== "true");
  };

  return (
    <div
      aria-hidden
      data-lit="false"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className={cn("group relative touch-manipulation select-none", className)}
    >
      {/* Clarão atrás do vidro (a parte de cima da imagem). */}
      <span
        className={cn(
          "pointer-events-none absolute top-[2%] left-1/2 aspect-square w-[130%] -translate-x-1/2 rounded-full bg-trilha/25 opacity-0 blur-3xl",
          flickerLayerClass,
          flickerClass,
        )}
      />
      <CollageImage art={collageArt.lampOff} sizes="160px" className="relative h-auto w-full" />
      <CollageImage
        art={collageArt.lampOn}
        sizes="160px"
        className={cn("absolute inset-0 h-auto w-full opacity-0", flickerLayerClass, flickerClass)}
      />
    </div>
  );
}
