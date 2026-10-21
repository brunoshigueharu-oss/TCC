import "server-only";

import { proficiency, type Proficiency } from "@/lib/data/proficiencia";

/**
 * Leitura do teste de proficiência. No protótipo usa dados fictícios; na
 * versão real chama a API de avaliações com a situação da pessoa logada.
 */
export async function getProficiency(): Promise<Proficiency> {
  return proficiency;
}
