"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import type { ActionResult } from "../../_lib/action-result";
import { signUpSchema, type SignUpInput } from "../../_lib/schemas";

/**
 * Cadastro do protótipo: só valida os campos e segue para o onboarding. Na
 * versão real, aqui a conta é criada no Supabase.
 */
export async function signUp(input: SignUpInput): Promise<ActionResult> {
  const validation = signUpSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  redirect("/onboarding");
}
