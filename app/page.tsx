import type { Metadata } from "next";

import { landingData } from "@/lib/data/landing";
import { hubFontClasses } from "@/lib/fonts";
import { FeatureCards } from "./_components/feature-cards";
import { LandingFooter } from "./_components/landing-footer";
import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";
import { ProductPreview } from "./_components/product-preview";
import { ShowcaseCanvas } from "./_components/showcase/showcase-canvas";

export const metadata: Metadata = {
  title: { absolute: "BASE8 · Aprenda IA de código para designers" },
};

/** Landing (web, Figma 61:17). Conteúdo estático de `lib/data/landing.ts`. */
export default function LandingPage() {
  const { features, preview, footerLinks, showcase, ...hero } = landingData;

  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-fundo font-texto text-texto`}>
      <LandingHeader />
      <main className="flex flex-1 flex-col">
        <LandingHero {...hero} />
        <ShowcaseCanvas showcase={showcase} />
        {/* Seções abaixo do herói: provisórias até o conteúdo final ser definido. */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-14 px-4 pt-14 pb-20 lg:gap-20 lg:pt-20 lg:px-10">
          <FeatureCards features={features} />
          <ProductPreview preview={preview} />
        </div>
      </main>
      <LandingFooter links={footerLinks} />
    </div>
  );
}
