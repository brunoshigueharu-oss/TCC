"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionResult } from "../../_lib/action-result";
import { IS_ENTRY_VALIDATION_ENABLED, loginSchema, type LoginInput } from "../../_lib/schemas";

/**
 * Login do protótipo: só valida os campos e leva para a Home. Na versão real,
 * aqui entra a autenticação do Supabase.
 */
export async function signIn(input: LoginInput): Promise<ActionResult> {
  const validation = loginSchema.safeParse(input);
  if (IS_ENTRY_VALIDATION_ENABLED && !validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  redirect("/inicio");
}
