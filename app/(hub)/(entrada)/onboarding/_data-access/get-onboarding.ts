import "server-only";

import { entradaData, type OnboardingStep } from "@/lib/data/entrada";

/** Passos do onboarding, na ordem em que aparecem. */
export async function getOnboardingSteps(): Promise<OnboardingStep[]> {
  return entradaData.onboardingSteps;
}
