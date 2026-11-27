import type { ReactNode, Ref } from "react";

import { collageArt, pickArt } from "@/lib/collage-art";
import type { LandingNote } from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import { CollageImage } from "../collage-image";

const rowBaseClass = "mx-auto grid max-w-[1040px] lg:grid-cols-3 lg:gap-x-10";
/** Fileira de post-its: três colunas a partir de 1024px; abaixo disso, empilhados. */
export const noteRowClass = cn(rowBaseClass, "gap-y-16");
/**
 * Fileira em que os post-its amassam: empilhados, o vão entre eles é maior,
 * porque é ali que a bolinha de cada um vai parar.
 */
export const crumpleRowClass = cn(rowBaseClass, "gap-y-28 lg:gap-y-16");

/** Para onde cada bolinha cai e quanto gira (lidos por `animate-paper-fall`). */
const dropClasses = [
  "[--drift:-22%] [--spin:-190deg]",
  "[--drift:10%] [--spin:210deg]",
  "[--drift:24%] [--spin:160deg]",
];

const IMAGE_SIZES = "(min-width: 1024px) 330px, 310px";
const paperLayerClass = "pointer-events-none absolute inset-0 size-full select-none transition-opacity duration-200";
/**
 * As fotos dos post-its vêm inclinadas uns 5° no sentido horário; o papel gira
 * de volta para ficar reto, alinhado com o texto. Espelhado, a inclinação
 * troca de lado (o `scale` é aplicado antes do `rotate`).
 */
const straightenClass = "-rotate-5";
const straightenMirroredClass = "-scale-x-100 rotate-5";

export type NoteCrumple = {
  isCrumpled: boolean;
  /** Rótulo pequeno acima da resposta. */
  label: string;
  /** O que aparece no lugar do post-it depois que ele cai. */
  resolution: string;
  onCrumple: () => void;
};

type PinnedNoteProps = {
  note: LandingNote;
  index: number;
  /** Liga o papel ao vento da fileira (`usePaperBreeze`). */
  paperRef: (element: HTMLElement | null) => void;
  /** Sem valor, o post-it não amassa. */
  crumple?: NoteCrumple;
  /** Resposta que recebe o foco quando o papel é amassado (o botão some com ele). */
  resolutionRef?: Ref<HTMLDivElement>;
  /** Enfeite preso à caixa do post-it (a dica com seta do primeiro). */
  callout?: ReactNode;
  /** Seta para o próximo post-it, quando a fileira conta uma sequência. */
  children?: ReactNode;
};

/**
 * Um post-it de colagem preso por um pino. O papel gira em volta do pino (a
 * origem fica a 14% do topo) e levanta a barra com o vento.
 *
 * Quando pode ser amassado, o clique troca o papel liso pelo amassado, que
 * encolhe e vira uma bolinha; a bolinha cai e, no lugar do papel, aparece a
 * resposta. O pino fica. A sequência inteira é CSS, a partir de um só estado
 * (`data-crumpled` no item, lido com `group-data-[crumpled=true]/note:`).
 */
export function PinnedNote({
  note,
  index,
  paperRef,
  crumple,
  resolutionRef,
  callout,
  children,
}: PinnedNoteProps) {
  // Só os pares liso + amassado no mesmo esquadro amassam; depois do último par, o desenho volta espelhado.
  const sheetIndex = index % collageArt.noteSheets.length;
  const isMirrored = crumple !== undefined && index >= collageArt.noteSheets.length;
  const smooth = crumple ? collageArt.noteSheets[sheetIndex].smooth : pickArt(collageArt.noteSmooth, index);

  return (
    <li data-crumpled={crumple?.isCrumpled ?? false} className="group/note relative flex justify-center">
      {/* Caixa do post-it: resposta, papel, bolinha e pino dividem este espaço. */}
      <div className="@container relative aspect-square w-full max-w-[330px]">
        {crumple ? (
          <div
            ref={resolutionRef}
            tabIndex={-1}
            aria-hidden={!crumple.isCrumpled}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-sm px-[8%] pt-[12%] text-center opacity-0 outline-none transition-opacity duration-500 group-data-[crumpled=true]/note:opacity-100 group-data-[crumpled=true]/note:delay-[490ms] focus-visible:ring-2 focus-visible:ring-texto"
          >
            <span className="text-xs font-semibold text-acao">{crumple.label}</span>
            <p className="font-display text-[clamp(17px,6.4cqw,21px)] leading-snug font-medium tracking-[-0.02em] text-balance">
              {crumple.resolution}
            </p>
          </div>
        ) : null}

        <article
          ref={paperRef}
          className={cn(
            "absolute inset-0 origin-[50%_14%] text-tinta will-change-transform group-data-[crumpled=true]/note:pointer-events-none",
            "[transform:perspective(900px)_rotateX(calc(var(--lift,0)*13deg))]",
            "[filter:drop-shadow(0_calc(var(--lift,0)*20px)_calc(var(--lift,0)*16px)_rgb(0_0_0/0.3))]",
          )}
        >
          <CollageImage
            art={smooth}
            sizes={IMAGE_SIZES}
            className={cn(
              paperLayerClass,
              "group-data-[crumpled=true]/note:opacity-0",
              isMirrored ? straightenMirroredClass : straightenClass,
            )}
          />
          {crumple ? (
            <CollageImage
              art={collageArt.noteSheets[sheetIndex].crumpled}
              sizes={IMAGE_SIZES}
              className={cn(
                paperLayerClass,
                // Com o mouse em cima, o papel liso já enruga um pouco: é o convite para amassar.
                "opacity-0 group-hover/note:opacity-35 group-data-[crumpled=true]/note:animate-paper-crumple",
                isMirrored ? straightenMirroredClass : straightenClass,
              )}
            />
          ) : null}
          {/* O texto fica dentro da área colorida do adesivo, abaixo do pino. */}
          <div className="absolute inset-0 flex flex-col gap-[3cqw] px-[15%] pt-[27%] pb-[13%] transition-opacity duration-150 group-data-[crumpled=true]/note:opacity-0">
            <h3 className="font-display text-[clamp(17px,7cqw,23px)] leading-[1.12] font-medium tracking-[-0.025em] text-balance">
              {note.title}
            </h3>
            <p className="text-[clamp(15px,5cqw,16px)] leading-snug text-pretty text-tinta/85">{note.description}</p>
          </div>
          {crumple && !crumple.isCrumpled ? (
            <button
              type="button"
              aria-label={`Amassar o post-it: ${note.title}`}
              onClick={crumple.onCrumple}
              className="absolute inset-[7%] cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tinta"
            />
          ) : null}
        </article>

        {/* Empilhados, a bolinha é menor e cai até o vão de baixo; lado a lado, cai no respiro da seção. */}
        {crumple ? (
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 w-[30%] -translate-x-1/2 -translate-y-1/2 [--fall:222%] lg:w-[42%] lg:[--fall:190%]">
            <CollageImage
              art={pickArt(collageArt.noteBall, index)}
              sizes="140px"
              className={cn(
                "invisible h-auto w-full select-none group-data-[crumpled=true]/note:animate-paper-fall",
                dropClasses[index % dropClasses.length],
              )}
            />
          </div>
        ) : null}

        <CollageImage
          art={pickArt(collageArt.pinsTop, index)}
          sizes="64px"
          className="pointer-events-none absolute top-[1%] left-1/2 z-20 h-auto w-[19%] -translate-x-1/2 select-none"
        />
        {callout}
      </div>
      {children}
    </li>
  );
}
