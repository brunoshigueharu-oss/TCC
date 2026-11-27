import type { LandingData } from "@/lib/data/landing";
import { LandingSection } from "./landing-section";
import { ProblemNotes } from "./notes/problem-notes";
import { Reveal } from "./reveal";

type ProblemSectionProps = {
  problem: LandingData["problem"];
};

/**
 * Seção "problema", na faixa preta: as três travas mais comuns em post-its
 * que dá para amassar. Cada bolinha cai no respiro de baixo da seção (por isso
 * ele é maior aqui) e deixa à mostra como o hub responde ao problema.
 */
export function ProblemSection({ problem }: ProblemSectionProps) {
  return (
    <LandingSection id={problem.id} title={problem.title} lead={problem.lead} hasShuffle className="pb-44 lg:pb-52">
      <Reveal delay={0.1} className="mt-6 lg:mt-8">
        <ProblemNotes problem={problem} />
      </Reveal>
    </LandingSection>
  );
}
