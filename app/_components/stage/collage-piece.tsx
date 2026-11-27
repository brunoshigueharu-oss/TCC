"use client";

import { useRef, type PointerEvent } from "react";

import { collageArt, type CollageArt } from "@/lib/collage-art";
import { clamp } from "@/lib/math";
import { cn } from "@/lib/utils";
import { CollageImage } from "../collage-image";

type ComparedObject = {
  id: string;
  photo: CollageArt;
  sticker: CollageArt;
  /** Lugar, tamanho e inclinação de partida na mesa (classes literais), iguais nas duas camadas. */
  placement: string;
  /** Largura aproximada na tela, para o navegador escolher o arquivo certo. */
  sizes: string;
};

/** Os objetos da mesa: cada foto tem o mesmo enquadramento do adesivo que saiu dela. */
const objects: ComparedObject[] = [
  {
    id: "lampada",
    photo: collageArt.photos.lampOn,
    sticker: collageArt.lampOn,
    placement: "left-[11%] top-[13%] w-[19%] -rotate-6",
    sizes: "140px",
  },
  {
    id: "lupa",
    photo: collageArt.photos.magnifier,
    sticker: collageArt.magnifier,
    placement: "left-[39%] top-[8%] w-[22%] rotate-[14deg]",
    sizes: "160px",
  },
  {
    id: "pino",
    photo: collageArt.photos.pinSide,
    sticker: collageArt.pinSide,
    placement: "left-[74%] top-[30%] w-[10%] rotate-[24deg]",
    sizes: "80px",
  },
];

type Version = "photo" | "sticker";

/** Recorte de cada camada: a foto vale à esquerda da linha, a colagem à direita. */
const layerClip: Record<Version, string> = {
  photo: "[clip-path:inset(0_50%_0_0)]",
  sticker: "[clip-path:inset(0_0_0_50%)]",
};

type Drag = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  fromX: number;
  fromY: number;
  /** Até onde o objeto pode andar (px), para o centro dele não sair da mesa. */
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

/**
 * Peça do palco: uma mesa dividida por uma linha fixa no meio. Do lado
 * esquerdo os objetos são a foto de origem; do direito, o adesivo de colagem
 * que saiu dela. Arrastar um objeto pela linha mostra a troca acontecendo, e
 * um objeto em cima da linha fica metade foto, metade colagem.
 *
 * Cada objeto existe nas duas camadas (foto e colagem), no mesmo lugar; a
 * camada de cada lado é recortada na linha. O arrasto move as duas cópias
 * juntas, escrevendo a posição direto no DOM (`translate`), sem re-render. O
 * objeto pego vai para a frente dos outros. Decorativa: o leitor de tela recebe
 * só a descrição.
 */
export function CollagePiece() {
  const tableRef = useRef<HTMLDivElement>(null);
  /** Quanto cada objeto já andou desde a posição de partida (px). */
  const offsetsRef = useRef(new Map<string, { x: number; y: number }>());
  const dragRef = useRef<Drag | null>(null);
  const topLayerRef = useRef(0);

  /** As duas cópias de um objeto (foto e colagem). */
  const copiesOf = (id: string) =>
    tableRef.current?.querySelectorAll<HTMLElement>(`[data-object="${id}"]`) ?? [];

  const handlePointerDown = (id: string) => (event: PointerEvent<HTMLDivElement>) => {
    const table = tableRef.current;
    if (!table) return;
    const offset = offsetsRef.current.get(id) ?? { x: 0, y: 0 };
    const edges = table.getBoundingClientRect();
    const box = event.currentTarget.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      fromX: offset.x,
      fromY: offset.y,
      minX: offset.x + edges.left - centerX,
      maxX: offset.x + edges.right - centerX,
      minY: offset.y + edges.top - centerY,
      maxY: offset.y + edges.bottom - centerY,
    };
    topLayerRef.current += 1;
    for (const copy of copiesOf(id)) {
      copy.style.zIndex = String(topLayerRef.current);
      copy.dataset.held = "true";
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const offset = {
      x: clamp(drag.fromX + event.clientX - drag.startX, drag.minX, drag.maxX),
      y: clamp(drag.fromY + event.clientY - drag.startY, drag.minY, drag.maxY),
    };
    offsetsRef.current.set(drag.id, offset);
    for (const copy of copiesOf(drag.id)) copy.style.translate = `${offset.x}px ${offset.y}px`;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    for (const copy of copiesOf(drag.id)) copy.dataset.held = "false";
  };

  const renderLayer = (version: Version) => (
    <div className={cn("absolute inset-0 isolate", layerClip[version])}>
      {objects.map((object) => (
        <div
          key={object.id}
          data-object={object.id}
          data-held="false"
          onPointerDown={handlePointerDown(object.id)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onLostPointerCapture={handlePointerEnd}
          className={cn(
            "absolute cursor-grab touch-none transition-[scale] duration-200 select-none data-[held=true]:scale-105 data-[held=true]:cursor-grabbing",
            object.placement,
          )}
        >
          <CollageImage art={object[version]} sizes={object.sizes} className="pointer-events-none h-auto w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-[760px] px-2 sm:px-6">
      <p className="sr-only">
        Uma mesa dividida ao meio: à esquerda, fotos de uma lâmpada acesa, uma lupa e um pino; à direita, os adesivos de
        colagem feitos a partir delas.
      </p>
      <div
        ref={tableRef}
        aria-hidden
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-linha bg-papel"
      >
        {renderLayer("sticker")}
        {renderLayer("photo")}
        <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-tinta" />
      </div>
      <div aria-hidden className="mt-3 grid grid-cols-2 text-xs font-medium text-texto-secundario">
        <span className="text-center">Foto</span>
        <span className="text-center">Colagem</span>
      </div>
    </div>
  );
}
