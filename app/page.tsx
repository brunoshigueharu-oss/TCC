import type { Metadata } from "next";

import { landingData } from "@/lib/data/landing";
import { hubFontClasses } from "@/lib/fonts";
import { ClosingSection } from "./_components/closing-section";
import { DemoSection } from "./_components/demo/demo-section";
import { FaqSection } from "./_components/faq-section";
import { LandingFooter } from "./_components/landing-footer";
import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";
import { PillarsSection } from "./_components/pillars-section";
import { ProblemSection } from "./_components/problem-section";
import { ProofSection } from "./_components/proof-section";
import { ShowcaseCanvas } from "./_components/showcase/showcase-canvas";

const TITLE = "BASE8 · Aprenda IA de código para designers";
const DESCRIPTION =
  "Trilha, prática com parecer de IA, comunidade e teste de proficiência para designers que querem criar com IA de código.";

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
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Landing (web). Narrativa de rolagem: herói → vitrine → problema → como
 * funciona → demonstração → números → perguntas → chamada final.
 * Conteúdo estático de `lib/data/landing.ts`.
 */
export default function LandingPage() {
  const { nav, showcase, problem, pillars, demo, proof, faq, closing, footer, ...hero } = landingData;

  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-fundo font-texto text-texto`}>
      <LandingHeader nav={nav} />
      <main className="flex flex-1 flex-col">
        <LandingHero {...hero} />
        <ShowcaseCanvas showcase={showcase} />
        <ProblemSection problem={problem} index={1} />
        <PillarsSection pillars={pillars} index={2} />
        <DemoSection demo={demo} index={3} />
        <ProofSection proof={proof} index={4} />
        <FaqSection faq={faq} index={5} />
        <ClosingSection closing={closing} />
      </main>
      <LandingFooter footer={footer} />
    </div>
  );
}
