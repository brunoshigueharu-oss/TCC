"use server";

import { z } from "zod";

import { reports } from "@/lib/data/moderacao";

const decisionSchema = z.object({
  reportId: z.string().min(1),
  decision: z.enum(["manter", "remover", "advertir"]),
});

export type DecisionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

const successMessages: Record<z.infer<typeof decisionSchema>["decision"], string> = {
  manter: "Conteúdo mantido. A denúncia foi arquivada e quem denunciou será avisado.",
  remover: "Conteúdo removido. A autoria e quem denunciou serão avisados.",
  advertir: "Advertência enviada. O conteúdo continua no ar e a denúncia segue em análise.",
};

/**
 * Registra a decisão sobre uma denúncia. No protótipo só valida e devolve a
 * mensagem; na versão real grava a decisão e notifica as pessoas envolvidas.
 */
export async function decideReport(
  _previous: DecisionResult | null,
  formData: FormData,
): Promise<DecisionResult> {
  const validation = decisionSchema.safeParse({
    reportId: formData.get("reportId"),
    decision: formData.get("decision"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Escolha uma decisão válida.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  const report = reports.find((item) => item.id === validation.data.reportId);
  if (!report) return { success: false, message: "Denúncia não encontrada." };
  if (report.status === "resolvida") {
    return { success: false, message: "Esta denúncia já foi resolvida." };
  }

  return { success: true, message: successMessages[validation.data.decision] };
}
