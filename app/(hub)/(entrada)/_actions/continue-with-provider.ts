"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const providerSchema = z.enum(["google", "github", "apple"]);
const destinationSchema = z.enum(["/onboarding", "/inicio"]);

export type SocialDestination = z.infer<typeof destinationSchema>;

/**
 * Entrada por conta social do protótipo: só confere o provedor e segue para o
 * destino (onboarding no cadastro, Home no login). Na versão real, aqui entra
 * `supabase.auth.signInWithOAuth({ provider })`.
 */
export async function continueWithProvider(
  destination: SocialDestination,
  formData: FormData,
): Promise<void> {
  const provider = providerSchema.safeParse(formData.get("provider"));
  const target = destinationSchema.safeParse(destination);
  if (!provider.success || !target.success) return;

  redirect(target.data);
}
