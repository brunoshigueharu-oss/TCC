import "server-only";

import { entradaData, type ConsentItem } from "@/lib/data/entrada";

export type ConsentPageData = {
  items: ConsentItem[];
  termsSummary: string[];
};

/** Preferências de uso de dados e o resumo dos termos. */
export async function getConsentData(): Promise<ConsentPageData> {
  return { items: entradaData.consentItems, termsSummary: entradaData.termsSummary };
}
