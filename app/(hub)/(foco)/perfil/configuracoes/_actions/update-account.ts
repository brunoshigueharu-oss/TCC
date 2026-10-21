"use server";

import { z } from "zod";

import { accountSchema, type AccountInput } from "@/lib/data/perfil";

export type UpdateAccountResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof AccountInput, string[]>>;
};

/**
 * Salva os dados da conta. No protótipo só valida com Zod e devolve o
 * resultado; na versão real grava no módulo Identidade da API.
 */
export async function updateAccount(input: AccountInput): Promise<UpdateAccountResult> {
  const validation = accountSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  return { success: true, message: "Dados da conta salvos." };
}
