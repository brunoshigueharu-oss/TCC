"use server";

import { z } from "zod";

import { findPost } from "@/lib/data/comunidade";
import { replySchema, type ReplyInput } from "./reply-schema";

export type ReplyResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof ReplyInput, string[]>>;
};

/**
 * Envia uma resposta ao post. Protótipo: só valida (não há banco). Na versão
 * real verifica a sessão e grava pelo módulo "Comunidades".
 */
export async function replyToPost(input: ReplyInput): Promise<ReplyResult> {
  const validation = replySchema.safeParse(input);
  if (!validation.success) {
    return { success: false, errors: z.flattenError(validation.error).fieldErrors };
  }

  if (!findPost(validation.data.postId)) {
    return { success: false, message: "Este post não existe mais." };
  }

  return {
    success: true,
    message: "Resposta enviada. Neste protótipo ela não fica salva.",
  };
}
