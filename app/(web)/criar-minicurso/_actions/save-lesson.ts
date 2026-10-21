"use server";

import { z } from "zod";

import { lessonFormSchema, type LessonFormValues } from "../_schemas/lesson-form";

export type SaveLessonResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * Salva a aula do rascunho. No protótipo só valida; na versão real grava no
 * módulo Cursos da comunidade com a autora da sessão.
 */
export async function saveLesson(input: LessonFormValues): Promise<SaveLessonResult> {
  const validation = lessonFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  return { success: true, message: `Aula “${validation.data.title}” salva no rascunho.` };
}
