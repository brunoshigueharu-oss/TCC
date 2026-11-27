"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type DraggableStickerProps = {
  /** O adesivo (imagem de colagem). */
  children: ReactNode;
  /** Lugar inicial, tamanho e inclinação (classes literais). */
  className?: string;
};

type DragStart = { pointerX: number; pointerY: number; offsetX: number; offsetY: number };

/**
 * Adesivo solto na mesa: dá para pegar e largar em qualquer lugar da seção.
 * O deslocamento vai nas variáveis `--drag-x`/`--drag-y` (sem re-render) e
 * fica preso aos limites da `<section>` em volta. Enquanto está na mão, o
 * adesivo cresce um pouco e ganha sombra, como papel levantado da mesa.
 * Decorativo (aria-hidden): o conteúdo da seção não depende dele.
 */
export function DraggableSticker({ children, className }: DraggableStickerProps) {
  const stickerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef<DragStart | null>(null);
  /** Folga que o adesivo ainda tem até cada borda da seção, medida ao pegar. */
  const boundsRef = useRef({ left: 0, right: 0, top: 0, bottom: 0 });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const sticker = event.currentTarget;
    sticker.setPointerCapture(event.pointerId);
    const rect = sticker.getBoundingClientRect();
    const section = sticker.closest("section")?.getBoundingClientRect();
    boundsRef.current = section
      ? {
          left: section.left - rect.left,
          right: section.right - rect.right,
          top: section.top - rect.top,
          bottom: section.bottom - rect.bottom,
        }
      : { left: -Infinity, right: Infinity, top: -Infinity, bottom: Infinity };
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      offsetX: offsetRef.current.x,
      offsetY: offsetRef.current.y,
    };
    sticker.dataset.dragging = "true";
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    const sticker = stickerRef.current;
    if (!start || !sticker) return;
    const bounds = boundsRef.current;
    const deltaX = Math.min(Math.max(event.clientX - start.pointerX, bounds.left), bounds.right);
    const deltaY = Math.min(Math.max(event.clientY - start.pointerY, bounds.top), bounds.bottom);
    offsetRef.current = { x: start.offsetX + deltaX, y: start.offsetY + deltaY };
    sticker.style.setProperty("--drag-x", `${offsetRef.current.x}px`);
    sticker.style.setProperty("--drag-y", `${offsetRef.current.y}px`);
  };

  const handleRelease = (event: PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = null;
    event.currentTarget.dataset.dragging = "false";
  };

  return (
    <div
      ref={stickerRef}
      aria-hidden
      data-dragging="false"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      className={cn(
        "absolute z-10 cursor-grab touch-none select-none [translate:var(--drag-x,0px)_var(--drag-y,0px)] data-[dragging=true]:z-20 data-[dragging=true]:cursor-grabbing",
        className,
      )}
    >
      <div className="transition-[scale,filter] duration-200 ease-out [filter:drop-shadow(0_2px_2px_rgb(0_0_0/0.08))] in-data-[dragging=true]:scale-110 in-data-[dragging=true]:[filter:drop-shadow(0_18px_16px_rgb(0_0_0/0.22))] [&_img]:pointer-events-none [&_img]:select-none">
        {children}
      </div>
    </div>
  );
}
