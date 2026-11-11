import type { LandingData } from "@/lib/data/landing";
import { formatTwoDigits } from "@/lib/format";
import { Reveal } from "./reveal";
import { LandingSection, SectionIntro } from "./section-intro";

type ProblemSectionProps = {
  problem: LandingData["problem"];
  index: number;
};

/**
 * Seção "o problema": uma frase grande e três travas comuns em colunas, cada
 * uma sob uma linha fina. Um prompt vago piscando abre a seção como
 * ilustração tipográfica.
 */
export function ProblemSection({ problem, index }: ProblemSectionProps) {
  const titleId = `${problem.id}-titulo`;

  return (
    <LandingSection id={problem.id} titleId={titleId}>
      <SectionIntro index={index} eyebrow={problem.eyebrow} title={problem.title} titleId={titleId}>
        <p
          aria-hidden
          className="flex w-fit items-center gap-2 rounded-lg bg-superficie px-3 py-2 font-mono text-[13px] text-texto-secundario"
        >
          <span className="text-desativado">&gt;</span>
          faça um site bonito
          <span className="h-4 w-[7px] animate-pulse bg-pratica motion-reduce:animate-none" />
        </p>
      </SectionIntro>

      <ol className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:mt-24 lg:ml-[calc(33.333%+0.833rem)] lg:gap-10">
        {problem.points.map((point, pointIndex) => (
          <li key={point.title}>
            <Reveal delay={pointIndex * 0.08} className="flex flex-col gap-3 border-t border-texto pt-4">
              <span className="font-mono text-[11px] tabular-nums text-texto-secundario">
                {formatTwoDigits(pointIndex + 1)}
              </span>
              <h3 className="font-display text-xl leading-snug font-medium tracking-[-0.02em]">{point.title}</h3>
              <p className="text-[15px] leading-relaxed text-texto-secundario">{point.description}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
