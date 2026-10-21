import "server-only";

import { findActivity, findNextActivity, practice, type Practice } from "@/lib/data/praticar";

/**
 * Leituras da área Praticar. No protótipo usam dados fictícios; na versão
 * real chamam a API de atividades com o histórico da pessoa logada.
 */

export async function getPractice(): Promise<Practice> {
  return practice;
}

export async function getActivity(activityId: string) {
  return findActivity(practice, activityId);
}

export async function getNextActivity(activityId: string) {
  return findNextActivity(practice, activityId);
}
