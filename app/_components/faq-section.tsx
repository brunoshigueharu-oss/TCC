import { Plus } from "lucide-react";

import type { LandingData } from "@/lib/data/landing";
import { formatTwoDigits } from "@/lib/format";
import { Reveal } from "./reveal";
import { LandingSection, SectionIntro } from "./section-intro";

type FaqSectionProps = {
  faq: LandingData["faq"];
  index: number;
};

/**
 * Perguntas frequentes com `<details>` nativo: abre pelo teclado, funciona
 * sem JS e é lido corretamente por leitor de tela. O "+" gira para "×".
 */
export function FaqSection({ faq, index }: FaqSectionProps) {
  const titleId = `${faq.id}-titulo`;

  return (
    <LandingSection id={faq.id} titleId={titleId}>
      <SectionIntro index={index} eyebrow={faq.eyebrow} title={faq.title} titleId={titleId} />

      <Reveal className="mt-12 lg:mt-16 lg:ml-[calc(33.333%+0.833rem)]">
        <div className="border-b border-linha">
          {faq.items.map((item, itemIndex) => (
            <details key={item.id} name="faq" className="group border-t border-linha">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-4 focus-visible:ring-offset-fundo [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[11px] tabular-nums text-texto-secundario">
                  {formatTwoDigits(itemIndex + 1)}
                </span>
                <span className="flex-1 font-display text-lg leading-snug font-medium tracking-[-0.02em] transition-transform duration-200 group-hover:translate-x-1 sm:text-xl">
                  {item.question}
                </span>
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 text-texto-secundario transition-transform duration-300 group-open:rotate-45 group-open:text-texto"
                  strokeWidth={1.5}
                />
              </summary>
              <p className="max-w-[60ch] pb-6 pl-[calc(11px*2+1rem)] text-[15px] leading-relaxed text-texto-secundario">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </LandingSection>
  );
}
