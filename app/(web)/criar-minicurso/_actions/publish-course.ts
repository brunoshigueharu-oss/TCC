"use server";

import { z } from "zod";

import { courseDraft, getPublishChecklist } from "@/lib/data/criar-minicurso";

const publishSchema = z.object({ courseId: z.string().min(1) });

export type PublishResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Publica o minicurso nos Cursos da comunidade. Confere o checklist no
 * servidor; no protótipo não grava nada.
 */
export async function publishCourse(
  _previous: PublishResult | null,
  formData: FormData,
): Promise<PublishResult> {
  const validation = publishSchema.safeParse({ courseId: formData.get("courseId") });
  if (!validation.success || validation.data.courseId !== courseDraft.id) {
    return { success: false, message: "Rascunho não encontrado." };
  }

  const pending = getPublishChecklist(courseDraft).filter((check) => !check.isDone);
  if (pending.length > 0) {
    return {
      success: false,
      message: `Antes de publicar: ${pending.map((check) => check.label.toLowerCase()).join("; ")}.`,
    };
  }

  return { success: true, message: "Minicurso publicado nos Cursos da comunidade." };
}
