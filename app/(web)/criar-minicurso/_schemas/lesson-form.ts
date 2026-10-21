import { z } from "zod";

/** Mínimo de caracteres para o texto da aula valer como conteúdo. */
export const MIN_CONTENT_LENGTH = 40;

/** Validação da aula no editor — usada no formulário e na Server Action. */
export const lessonFormSchema = z
  .object({
    courseId: z.string().min(1),
    lessonId: z.string().min(1),
    title: z
      .string()
      .trim()
      .min(3, "Dê um título com pelo menos 3 caracteres.")
      .max(80, "Use no máximo 80 caracteres."),
    description: z
      .string()
      .trim()
      .min(10, "Resuma a aula em uma frase (mínimo de 10 caracteres).")
      .max(140, "Use no máximo 140 caracteres."),
    content: z.string().trim().max(5000, "Use no máximo 5.000 caracteres."),
    hasVideo: z.boolean(),
  })
  .refine((lesson) => lesson.hasVideo || lesson.content.length >= MIN_CONTENT_LENGTH, {
    path: ["content"],
    message: `Envie um vídeo ou escreva pelo menos ${MIN_CONTENT_LENGTH} caracteres.`,
  });

export type LessonFormValues = z.infer<typeof lessonFormSchema>;
