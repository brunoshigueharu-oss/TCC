"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { findPost } from "@/lib/data/comunidade";
import { reportSchema, type ReportInput } from "./report-schema";

export type ReportResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof ReportInput, string[]>>;
};

/**
 * Denuncia um post para a moderação. Protótipo: só valida e volta para o post
 * com a confirmação (`?denunciado=1`). Na versão real grava na fila de moderação.
 */
export async function reportPost(input: ReportInput): Promise<ReportResult> {
  const validation = reportSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, errors: z.flattenError(validation.error).fieldErrors };
  }

  const post = findPost(validation.data.postId);
  if (!post) {
    return { success: false, message: "Este post não existe mais." };
  }

  redirect(`/comunidade/posts/${post.id}?denunciado=1`);
}
