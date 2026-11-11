import type { Metadata } from "next";

import { BrandHeader } from "../_components/brand-header";
import { parsePosition } from "../_lib/parse-position";
import { OnboardingForm } from "./_components/onboarding-form";
import { getOnboardingSteps } from "./_data-access/get-onboarding";

export const metadata: Metadata = { title: "Primeiros passos" };

/**
 * Onboarding: três perguntas de escolha única; o passo atual fica na URL
 * (`?passo=N`, que também troca o desenho do painel). O último leva aos dados.
 */
export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const steps = await getOnboardingSteps();
  const position = parsePosition((await searchParams).passo, steps.length);
  const step = steps[position - 1];
  const isLastStep = position === steps.length;

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8 lg:flex-none lg:px-0 lg:pt-0 lg:pb-0">
        <OnboardingForm
          key={step.id}
          step={step}
          position={position}
          total={steps.length}
          nextHref={isLastStep ? "/consentimento" : `/onboarding?passo=${position + 1}`}
          previousHref={position > 1 ? `/onboarding?passo=${position - 1}` : null}
        />
      </main>
    </>
  );
}
