"use client";

import { ArrowRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import type { MouseEvent } from "react";

import { ActionLink } from "@/components/action-link";
import { isInsideTrack, useStackCarousel } from "@/hooks/use-stack-carousel";
import { createArrowKeyHandler } from "@/lib/arrow-keys";
import type { HubScreen } from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import { AccentDot } from "../accent-dot";
import { ArrowButton } from "../arrow-button";
import { DotList } from "../dot-list";
import { ExpandPanel } from "../expand-panel";
import { StepCounter } from "../step-counter";

type HubCarouselProps = {
  screens: HubScreen[];
  initialIndex: number;
  /** Rótulo pequeno do painel de cada tela. */
  eyebrow: string;
  /** Texto do link que leva à tela de verdade. */
  openLabel: string;
};

/** Tamanho real das capturas do hub (1440×900 a 1,5×). */
const CAPTURE = { width: 2160, height: 1350 } as const;
/** Moldura de cada tela: mesma regra para as telas e para o espaçador invisível. */
const frameSizeClass = "aspect-[16/10] w-[min(72vw,760px)]";

/**
 * A partir do tablet as setas ficam por cima do trilho, nas pontas; no celular,
 * ao lado do contador. Ficam fora da camada isolada das telas, sempre na frente.
 */
const edgeArrowClass = "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:flex";

/** Conteúdo do painel de uma tela: a captura inteira, o que ela faz e o link para abrir. */
function ScreenDetails({ screen, openLabel }: { screen: HubScreen; openLabel: string }) {
  return (
    <div className="flex flex-col gap-7">
      <div className="overflow-hidden rounded-xl border border-linha bg-superficie">
        <Image
          src={screen.image.src}
          alt={screen.image.alt}
          width={CAPTURE.width}
          height={CAPTURE.height}
          sizes="(min-width: 920px) 816px, 92vw"
          className="h-auto w-full"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
        <div className="flex flex-col items-start gap-6">
          <p className="text-base leading-relaxed text-texto-secundario">{screen.description}</p>
          <ActionLink href={screen.href} variant="secondary">
            {openLabel}
            <ArrowRight aria-hidden />
          </ActionLink>
        </div>
        <DotList items={screen.highlights} accent={screen.accent} />
      </div>
    </div>
  );
}

/**
 * Carrossel das áreas do hub, sem fim e em pilha: a tela do centro fica na
 * frente e as vizinhas meio atrás dela, como cartas que vão girando. Dá para
 * passar com as setas, arrastando, com a roda horizontal ou pelo teclado. A
 * tela do centro expande num painel com mais informações; clicar numa vizinha
 * só a traz para a frente.
 */
export function HubCarousel({ screens, initialIndex, eyebrow, openLabel }: HubCarouselProps) {
  const count = screens.length;
  const { trackRef, itemRef, activeIndex, isDragging, scrollToIndex, scrollByStep, handlers } = useStackCarousel({
    count,
    initialIndex,
  });
  const activeScreen = screens[activeIndex];
  const handleKeyDown = createArrowKeyHandler(scrollByStep);

  /** Tela fora do centro: o clique não abre o painel, só centraliza. */
  const handleSideClickCapture = (index: number) => (event: MouseEvent<HTMLDivElement>) => {
    // Cliques dentro do painel aberto (um portal) também passam por aqui: esses são do painel.
    if (index === activeIndex || !isInsideTrack(event)) return;
    event.preventDefault();
    event.stopPropagation();
    scrollToIndex(index);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Trilho e setas das pontas: as setas ficam fora da camada isolada das telas, sempre na frente delas. */}
      <div className="relative w-full">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Áreas do hub. Use as setas para navegar."
          tabIndex={0}
          onKeyDown={handleKeyDown}
          {...handlers}
          className={cn(
            "relative isolate w-full touch-pan-y overflow-hidden py-6 outline-none select-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-inset",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
        >
          {/* Espaçador invisível: dá a altura do trilho, já que as telas são absolutas. */}
          <div aria-hidden className="invisible mx-auto flex w-fit flex-col gap-3">
            <span className="text-xs">&nbsp;</span>
            <div className={frameSizeClass} />
          </div>

          <ul className="absolute inset-0">
            {screens.map((screen, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={screen.id}
                  aria-current={isActive || undefined}
                  className="pointer-events-none absolute inset-x-0 top-6 flex justify-center"
                >
                  <div
                    ref={itemRef(index)}
                    onClickCapture={handleSideClickCapture(index)}
                    className="pointer-events-auto flex origin-center flex-col gap-3 will-change-transform"
                  >
                    {/* Só a tela da frente mostra o nome: os das vizinhas ficariam soltos por cima dela. */}
                    <span
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <AccentDot accent={screen.accent} className="size-2" />
                      {screen.name}
                    </span>
                    <ExpandPanel
                      eyebrow={eyebrow}
                      title={screen.name}
                      triggerLabel={isActive ? `${screen.name}: ver mais informações` : `Ir para ${screen.name}`}
                      // Pelo teclado, as setas no carrossel trocam a tela; o Tab só para na da frente.
                      isTriggerTabbable={isActive}
                      triggerClassName={cn(
                        "group relative block overflow-hidden rounded-xl border border-linha bg-superficie outline-none transition-[border-color] duration-300 focus-visible:ring-2 focus-visible:ring-texto",
                        frameSizeClass,
                        isActive ? "cursor-pointer hover:border-texto" : "cursor-[inherit]",
                      )}
                      trigger={
                        <>
                          <Image
                            src={screen.image.src}
                            alt=""
                            width={CAPTURE.width}
                            height={CAPTURE.height}
                            sizes="(min-width: 960px) 720px, 76vw"
                            draggable={false}
                            className="pointer-events-none size-full object-cover object-left-top"
                          />
                          {/* Sombra das telas de trás: a força vem do carrossel, em `--dim`. */}
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-fundo opacity-[var(--dim,0)]"
                          />
                          <span
                            aria-hidden
                            className={cn(
                              "absolute top-2 right-2 flex h-8 items-center gap-2 rounded-full bg-tinta/90 px-2.5 text-xs font-semibold text-papel transition-[opacity,translate] duration-300 group-hover:bg-tinta sm:top-3 sm:right-3 sm:h-9 sm:pr-3.5 sm:pl-3",
                              isActive ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                            )}
                          >
                            <Maximize2 className="size-3.5" strokeWidth={2} />
                            <span className="hidden sm:inline">Ver mais</span>
                          </span>
                        </>
                      }
                    >
                      <ScreenDetails screen={screen} openLabel={openLabel} />
                    </ExpandPanel>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <ArrowButton
          direction={-1}
          label="Área anterior"
          onStep={scrollByStep}
          className={cn(edgeArrowClass, "left-6 lg:left-10")}
        />
        <ArrowButton
          direction={1}
          label="Próxima área"
          onStep={scrollByStep}
          className={cn(edgeArrowClass, "right-6 lg:right-10")}
        />
      </div>

      {/* No celular as setas ficam ao lado do contador, fora do caminho do dedo que arrasta. */}
      <div className="mt-4 flex items-center gap-5">
        <ArrowButton direction={-1} label="Área anterior" onStep={scrollByStep} className="sm:hidden" />
        <StepCounter index={activeIndex} count={count} />
        <ArrowButton direction={1} label="Próxima área" onStep={scrollByStep} className="sm:hidden" />
      </div>
      <p
        aria-live="polite"
        className="mt-3 max-w-[560px] px-4 text-center text-base leading-relaxed text-texto-secundario"
      >
        <span className="sr-only">{activeScreen.name}: </span>
        {activeScreen.description}
      </p>
    </div>
  );
}
