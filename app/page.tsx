import type { Metadata } from "next";

import { landingData } from "@/lib/data/landing";
import { orbData } from "@/lib/data/orbe";
import { hubFontClasses } from "@/lib/fonts";
import { ClosingSection } from "./_components/closing-section";
import { FaqSection } from "./_components/faq-section";
import { HubSection } from "./_components/hub/hub-section";
import { LandingFooter } from "./_components/landing-footer";
import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";
import { ProblemSection } from "./_components/problem-section";
import { ScenarioSection } from "./_components/scenario-section";
import { DarkBand } from "./_components/dark-band";
import { SolutionSection } from "./_components/solution/solution-section";
import { StageSection } from "./_components/stage/stage-section";

const TITLE = "BASE8 · Aprenda IA de código para designers";
const DESCRIPTION =
  "Trilha, comunidade e prática para designers que querem criar com IA de código: de um objeto 3D a uma vetorização.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "BASE8",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Landing (web). Narrativa de rolagem: herói → o que dá para criar → cenário →
 * problema → solução → hub → perguntas → chamada final. Conteúdo estático de
 * `lib/data/landing.ts`.
 *
 * O fundo alterna entre branco e preto por seção (`DarkBand`); a página em
 * si continua no tema claro.
 */
export default function LandingPage() {
  const { nav, stage, scenario, problem, solution, hub, faq, closing, footer, ...hero } = landingData;

  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-fundo font-texto text-texto`}>
      {/* Primeiro item do Tab: pula o header e vai direto para o conteúdo. */}
      <a
        href="#conteudo"
        className="sr-only rounded-full bg-texto px-5 py-3 text-sm font-medium text-fundo focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <LandingHeader nav={nav} cta={hero.primaryCta} />
      <main id="conteudo" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <LandingHero {...hero} />
        <StageSection stage={stage} orbStages={orbData.stages} />
        <ScenarioSection scenario={scenario} />
        <DarkBand>
          <ProblemSection problem={problem} />
        </DarkBand>
        <SolutionSection solution={solution} />
        <DarkBand>
          <HubSection hub={hub} />
        </DarkBand>
        <FaqSection faq={faq} />
        {/* `overflow-hidden`: o clarão das lâmpadas não vaza para a seção de cima. */}
        <DarkBand className="overflow-hidden">
          <ClosingSection closing={closing} cta={hero.primaryCta} />
        </DarkBand>
      </main>
      <DarkBand>
        <LandingFooter footer={footer} nav={nav} />
      </DarkBand>
    </div>
  );
}
