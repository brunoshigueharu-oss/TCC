import type { LandingData } from "@/lib/data/landing";
import { LandingSection } from "./landing-section";
import { SequenceNotes } from "./notes/sequence-notes";
import { Reveal } from "./reveal";

type ScenarioSectionProps = {
  scenario: LandingData["scenario"];
};

/**
 * Seção "cenário": três post-its em sequência (quem é a pessoa → o que ela
 * quer → a dúvida que sobra), ligados por setas pontilhadas.
 */
export function ScenarioSection({ scenario }: ScenarioSectionProps) {
  return (
    <LandingSection id={scenario.id} title={scenario.title} hasShuffle>
      <Reveal delay={0.1} className="mt-12 lg:mt-16">
        <SequenceNotes notes={scenario.steps} />
      </Reveal>
    </LandingSection>
  );
}
