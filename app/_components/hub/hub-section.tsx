import type { LandingData } from "@/lib/data/landing";
import { LandingSection } from "../landing-section";
import { Reveal } from "../reveal";
import { HubCarousel } from "./hub-carousel";

type HubSectionProps = {
  hub: LandingData["hub"];
};

/**
 * Seção "conheça o hub": as áreas do app em capturas reais, num carrossel em
 * pilha. Ocupa a largura toda da página para as telas vizinhas aparecerem
 * cortadas nas bordas.
 */
export function HubSection({ hub }: HubSectionProps) {
  // O schema garante que `initialId` é uma das telas.
  const initialIndex = hub.screens.findIndex((screen) => screen.id === hub.initialId);

  return (
    <LandingSection id={hub.id} title={hub.title} width="full">
      <Reveal delay={0.1} className="mt-8 lg:mt-12">
        <HubCarousel
          screens={hub.screens}
          initialIndex={initialIndex}
          eyebrow={hub.screenEyebrow}
          openLabel={hub.openLabel}
        />
      </Reveal>
    </LandingSection>
  );
}
