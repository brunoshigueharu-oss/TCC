import type { LandingData } from "@/lib/data/landing";
import { Reveal } from "../reveal";
import { LandingSection, SectionIntro } from "../section-intro";
import { PromptDemo } from "./prompt-demo";

type DemoSectionProps = {
  demo: LandingData["demo"];
  index: number;
};

/** Seção da demonstração: abertura editorial + o exercício interativo. */
export function DemoSection({ demo, index }: DemoSectionProps) {
  const titleId = `${demo.id}-titulo`;

  return (
    <LandingSection id={demo.id} titleId={titleId}>
      <SectionIntro index={index} eyebrow={demo.eyebrow} title={demo.title} titleId={titleId}>
        <p className="max-w-[56ch] text-base leading-relaxed text-texto-secundario sm:text-lg">{demo.description}</p>
      </SectionIntro>
      <Reveal className="mt-14 lg:mt-20">
        <PromptDemo demo={demo} />
      </Reveal>
    </LandingSection>
  );
}
