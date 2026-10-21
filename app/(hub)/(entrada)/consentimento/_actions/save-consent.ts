"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionResult } from "../../_lib/action-result";
import { consentSchema, type ConsentInput } from "../../_lib/schemas";

/**
 * Salva as preferências de dados. Protótipo: só valida e segue para o
 * nivelamento. Na versão real, grava no perfil da pessoa.
 */
export async function saveConsent(input: ConsentInput): Promise<ActionResult> {
  const validation = consentSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: "Não foi possível salvar suas preferências. Tente de novo.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  redirect("/nivelamento");
}
