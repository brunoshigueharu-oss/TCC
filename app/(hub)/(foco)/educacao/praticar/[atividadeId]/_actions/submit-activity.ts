"use server";

import { redirect } from "next/navigation";

import { activityAnswerSchema, findActivity, practice } from "@/lib/data/praticar";

export type SubmitActivityResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<"answer" | "link", string[]>>;
};

/**
 * Envia a resposta da atividade para avaliação. No protótipo só valida e
 * leva ao resultado; na versão real grava a resposta e dispara a avaliação
 * pela IA.
 */
export async function submitActivity(
  activityId: string,
  input: unknown,
): Promise<SubmitActivityResult> {
  if (!findActivity(practice, activityId)) {
    return { success: false, message: "Atividade não encontrada." };
  }

  const validation = activityAnswerSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: "Revise a resposta antes de enviar.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  redirect(`/educacao/praticar/${activityId}/resultado`);
}
