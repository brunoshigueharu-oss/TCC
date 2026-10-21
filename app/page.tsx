import type { Metadata } from "next";

import { landingData } from "@/lib/data/landing";
import { hubFontClasses } from "@/lib/fonts";
import { FeatureCards } from "./_components/feature-cards";
import { LandingFooter } from "./_components/landing-footer";
import { LandingHeader } from "./_components/landing-header";
import { LandingHero } from "./_components/landing-hero";
import { ProductPreview } from "./_components/product-preview";

export const metadata: Metadata = { title: "Aprenda IA de código para designers" };

/** Landing (web, Figma 61:17). Conteúdo estático de `lib/data/landing.ts`. */
export default function LandingPage() {
  const { features, preview, footerLinks, ...hero } = landingData;

  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-superficie font-texto text-texto`}>
      <LandingHeader />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-14 px-4 pt-8 pb-20 lg:gap-20 lg:px-10 lg:pt-14">
        <LandingHero {...hero} />
        <FeatureCards features={features} />
        <ProductPreview preview={preview} />
      </main>
      <LandingFooter links={footerLinks} />
    </div>
  );
}
