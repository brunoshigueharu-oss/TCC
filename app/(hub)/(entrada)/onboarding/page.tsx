import type { Metadata } from "next";

import { SurfaceCard } from "@/components/surface-card";
import { BrandHeader } from "../_components/brand-header";
import { parsePosition } from "../_lib/parse-position";
import { OnboardingForm } from "./_components/onboarding-form";
import { StepIndicator } from "./_components/step-indicator";
import { getOnboardingSteps } from "./_data-access/get-onboarding";

export const metadata: Metadata = { title: "Primeiros passos" };

/**
 * Onboarding (Figma: "Onboarding"). Três perguntas de escolha única; o passo
 * atual fica na URL (`?passo=N`). O último passo leva ao consentimento.
 */
export default async function OnboardingPage({ searchParams }: PageProps<"/onboarding">) {
  const steps = await getOnboardingSteps();
  const position = parsePosition((await searchParams).passo, steps.length);
  const step = steps[position - 1];
  const isLastStep = position === steps.length;
  const nextHref = isLastStep ? "/consentimento" : `/onboarding?passo=${position + 1}`;

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-5 pt-2 pb-6">
        <SurfaceCard className="flex flex-col gap-4 p-4">
          <StepIndicator current={position} labels={steps.map(({ shortLabel }) => shortLabel)} />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[22px] leading-tight font-bold">{step.title}</h1>
            <p className="text-sm text-texto-secundario">{step.description}</p>
          </div>
        </SurfaceCard>

        <OnboardingForm
          key={step.id}
          stepId={step.id}
          legend={step.title}
          options={step.options}
          nextHref={nextHref}
        />
      </main>
    </>
  );
}
