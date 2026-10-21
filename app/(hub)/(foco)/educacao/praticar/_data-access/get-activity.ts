import "server-only";

import { findActivity, findNextActivity, practice } from "@/lib/data/praticar";

/**
 * Leituras das telas de foco do Praticar (atividade e resultado). No
 * protótipo usam dados fictícios; na versão real chamam a API de atividades.
 */

export async function getActivity(activityId: string) {
  return findActivity(practice, activityId);
}

export async function getNextActivity(activityId: string) {
  return findNextActivity(practice, activityId);
}
