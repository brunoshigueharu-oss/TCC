import "server-only";

import { proficiency, type Proficiency } from "@/lib/data/proficiencia";

/**
 * Leitura do teste para a prova e o resultado. No protótipo usa dados
 * fictícios; na versão real o gabarito nunca sai do servidor da API.
 */
export async function getProficiency(): Promise<Proficiency> {
  return proficiency;
}
