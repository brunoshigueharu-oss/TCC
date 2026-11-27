import { Plus } from "lucide-react";

import { collageArt } from "@/lib/collage-art";
import type { LandingData } from "@/lib/data/landing";
import { CollageImage } from "./collage-image";
import { DraggableSticker } from "./faq/draggable-sticker";
import { InteractionHint } from "./interaction-hint";
import { LandingSection } from "./landing-section";
import { Reveal } from "./reveal";

type FaqSectionProps = {
  faq: LandingData["faq"];
};

/**
 * Perguntas frequentes com `<details>` nativo: abre pelo teclado, funciona
 * sem JS e é lido corretamente por leitor de tela. O "+" gira para "×". Em
 * telas largas, os adesivos de colagem (lupa, pino e bolinha de papel) ficam
 * soltos nas margens, como numa mesa: dá para arrastá-los pela seção
 * (`DraggableSticker`). Em telas menores, a lupa vira um enfeite pequeno
 * acima do título.
 */
export function FaqSection({ faq }: FaqSectionProps) {
  return (
    <LandingSection
      id={faq.id}
      title={faq.title}
      aboveTitle={
        <CollageImage
          art={collageArt.magnifier}
          sizes="72px"
          className="mx-auto mb-4 h-auto w-[72px] -rotate-12 select-none xl:hidden"
        />
      }
    >
      <Reveal delay={0.1} className="mx-auto mt-12 max-w-[720px] lg:mt-16">
        <div className="relative border-b border-linha">
          <div className="hidden xl:block">
            <DraggableSticker className="top-[-2%] right-full mr-7 w-[150px]">
              <CollageImage art={collageArt.magnifier} sizes="150px" className="h-auto w-full -scale-x-100" />
            </DraggableSticker>
            <DraggableSticker className="top-[18%] left-full ml-24 w-[70px]">
              <CollageImage art={collageArt.pinSide} sizes="70px" className="h-auto w-full rotate-[24deg]" />
            </DraggableSticker>
            <DraggableSticker className="top-[52%] left-full ml-9 w-[124px]">
              <CollageImage art={collageArt.noteBall[1]} sizes="124px" className="h-auto w-full -rotate-12" />
            </DraggableSticker>
          </div>

          {faq.items.map((item) => (
            <details key={item.id} name="faq" className="group border-t border-linha">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-4 focus-visible:ring-offset-fundo [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-display text-lg leading-snug font-medium tracking-[-0.02em] transition-transform duration-200 group-hover:translate-x-1 sm:text-xl">
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 text-texto-secundario transition-transform duration-300 group-open:rotate-45 group-open:text-texto"
                  strokeWidth={1.5}
                />
              </summary>
              <p className="max-w-[60ch] pb-6 text-[15px] leading-relaxed text-texto-secundario">{item.answer}</p>
            </details>
          ))}
        </div>
        <InteractionHint hint={faq.hint} className="mt-8 hidden xl:flex" />
      </Reveal>
    </LandingSection>
  );
}
