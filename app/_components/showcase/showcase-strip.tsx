"use client";

import { ArrowUpRight } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

import { useInfiniteCarousel } from "@/hooks/use-infinite-carousel";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export type ShowcaseStripItem = {
  id: string;
  caption: string;
  url: string;
  content: ReactNode;
};

type ShowcaseStripProps = {
  title: string;
  items: ShowcaseStripItem[];
  initialIndex: number;
};

/** Espaço entre as peças (px). Precisa bater com a largura usada no layout. */
const ITEM_GAP_PX = 56;

/** Tamanho da peça: mesma regra para as peças e para o espaçador invisível. */
const frameSizeClass = "aspect-[16/10] h-[170px] max-w-[78vw] sm:h-[380px]";

/**
 * Faixa da vitrine em forma de canvas: arrasta para o lado (mouse, dedo ou
 * trackpad), sem fim, e sempre assenta com uma peça no centro — que cresce
 * um pouco enquanto está ali.
 */
export function ShowcaseStrip({ title, items, initialIndex }: ShowcaseStripProps) {
  const count = items.length;
  const { trackRef, itemRef, activeIndex, isDragging, scrollToIndex, scrollByStep, handlers } =
    useInfiniteCarousel({ count, initialIndex, gap: ITEM_GAP_PX });
  const activeItem = items[activeIndex];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByStep(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByStep(-1);
    }
  };

  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between px-6 pt-5 text-sm text-texto-secundario sm:px-8 sm:pt-6">
        <h2 id="vitrine" className="flex items-center gap-2">
          <span aria-hidden className="size-1.5 rounded-full bg-desativado" />
          {title}
        </h2>
        <span aria-hidden className="font-mono text-xs tabular-nums">
          {formatTwoDigits(activeIndex + 1)} / {formatTwoDigits(count)}
        </span>
      </header>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Exemplos de projetos. Use as setas para navegar."
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...handlers}
        className={cn(
          "relative touch-pan-y overflow-hidden pt-12 pb-10 outline-none select-none focus-visible:ring-2 focus-visible:ring-acao focus-visible:ring-inset sm:pt-16 sm:pb-12",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        {/* Espaçador invisível: dá a altura da faixa, já que as peças são absolutas. */}
        <div aria-hidden className="invisible flex flex-col items-center gap-2">
          <span className="text-[13px]">&nbsp;</span>
          <div className={frameSizeClass} />
          <span className="h-7" />
        </div>

        <ul className="absolute inset-0">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const host = new URL(item.url).hostname.replace(/^www\./, "");
            return (
              <li
                key={item.id}
                aria-current={isActive || undefined}
                className="pointer-events-none absolute inset-x-0 top-12 flex justify-center sm:top-16"
              >
                <div
                  ref={itemRef(index)}
                  onClick={() => !isActive && scrollToIndex(index)}
                  className="pointer-events-auto flex origin-center flex-col items-start gap-2 will-change-transform"
                >
                  <span
                    className={cn(
                      "text-[13px] transition-colors duration-300",
                      isActive ? "text-comunidade" : "text-texto-secundario",
                    )}
                  >
                    {item.caption}
                  </span>
                  <div
                    className={cn(
                      "pointer-events-none min-w-0 overflow-hidden rounded-sm shadow-[0_24px_48px_-24px_rgb(24_24_27/0.35)] transition-shadow duration-500",
                      isActive && "shadow-[0_32px_64px_-24px_rgb(24_24_27/0.45)]",
                      frameSizeClass,
                    )}
                  >
                    {item.content}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive || undefined}
                    className={cn(
                      "flex items-center gap-1 self-center rounded-full bg-white px-3 py-1 text-xs font-medium whitespace-nowrap text-texto shadow-[0_4px_12px_-6px_rgb(24_24_27/0.3)] transition-[opacity,translate,background-color] duration-300 hover:bg-comunidade hover:text-white focus-visible:ring-2 focus-visible:ring-acao focus-visible:outline-none",
                      isActive ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                    )}
                  >
                    Abrir {host}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p aria-live="polite" className="sr-only">
        {activeItem && `Exemplo ${activeIndex + 1} de ${count}: ${activeItem.caption}`}
      </p>

      <p
        aria-hidden
        className="hidden items-center justify-end gap-2 px-8 pb-6 text-sm text-texto-secundario lg:flex"
      >
        Arraste para ver mais
        <span className="text-lg">→</span>
      </p>
    </div>
  );
}
