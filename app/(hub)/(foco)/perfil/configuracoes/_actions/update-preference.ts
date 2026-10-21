"use server";

import { z } from "zod";

import { preferencesSchema } from "@/lib/data/perfil";

const preferenceChangeSchema = z.object({
  key: preferencesSchema.keyof(),
  value: z.boolean(),
});

export type PreferenceChange = z.infer<typeof preferenceChangeSchema>;

export type UpdatePreferenceResult = {
  success: boolean;
  message?: string;
};

/**
 * Liga ou desliga uma preferência (notificação ou privacidade). No protótipo
 * só valida; na versão real grava nas preferências da conta.
 */
export async function updatePreference(input: PreferenceChange): Promise<UpdatePreferenceResult> {
  const validation = preferenceChangeSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, message: "Não foi possível salvar esta preferência." };
  }

  return { success: true };
}
