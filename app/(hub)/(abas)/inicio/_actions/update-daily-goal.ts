"use server";

import { dailyGoalInputSchema, type DailyGoalInput } from "@/lib/data/home";

export type UpdateDailyGoalResult = {
  success: boolean;
  message?: string;
};

/**
 * Salva a meta diária de lições. No protótipo só valida com Zod; na versão
 * real grava nas preferências de estudo da pessoa logada.
 */
export async function updateDailyGoal(input: DailyGoalInput): Promise<UpdateDailyGoalResult> {
  const validation = dailyGoalInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, message: "Não foi possível salvar a meta. Tente de novo." };
  }

  return { success: true };
}
