"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { listLessonOptions } from "@/lib/data/comunidade";
import { postSchema, type PostInput } from "./post-schema";

export type CreatePostResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof PostInput, string[]>>;
};

/**
 * Publica um post. Protótipo: só valida (não há banco) e volta ao feed com a
 * confirmação (`?publicado=1`). Na versão real verifica a sessão e grava.
 */
export async function createPost(input: PostInput): Promise<CreatePostResult> {
  const validation = postSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, errors: z.flattenError(validation.error).fieldErrors };
  }

  const { lessonId } = validation.data;
  if (lessonId && !listLessonOptions().some((lesson) => lesson.id === lessonId)) {
    return { success: false, errors: { lessonId: ["Escolha uma lição da lista."] } };
  }

  redirect("/comunidade?publicado=1");
}
