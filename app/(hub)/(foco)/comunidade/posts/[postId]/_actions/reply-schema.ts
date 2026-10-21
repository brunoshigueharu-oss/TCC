import { z } from "zod";

/** Resposta a um post — compartilhado entre o formulário e a Server Action. */
export const replySchema = z.object({
  postId: z.string().min(1),
  body: z
    .string()
    .trim()
    .min(5, { error: "Escreva pelo menos 5 caracteres." })
    .max(2000, { error: "Use no máximo 2.000 caracteres." }),
});

export type ReplyInput = z.infer<typeof replySchema>;
