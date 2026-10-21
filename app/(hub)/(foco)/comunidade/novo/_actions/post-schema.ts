import { z } from "zod";

/** Limite de tags por post: ajuda o post a aparecer nos feeds certos sem poluir. */
export const MAX_POST_TAGS = 3;

export const postTagSlugs = ["prompts", "layout", "componentes", "estado", "acessibilidade", "ferramentas"] as const;

/** Novo post — compartilhado entre o formulário e a Server Action. */
export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { error: "Escreva um título com pelo menos 10 caracteres." })
    .max(120, { error: "Use no máximo 120 caracteres." }),
  type: z.enum(["pergunta", "discussao"], { error: "Escolha o tipo do post." }),
  tags: z
    .array(z.enum(postTagSlugs))
    .min(1, { error: "Escolha pelo menos uma tag." })
    .max(MAX_POST_TAGS, { error: `Escolha no máximo ${MAX_POST_TAGS} tags.` }),
  body: z
    .string()
    .trim()
    .min(20, { error: "Descreva com pelo menos 20 caracteres." })
    .max(5000, { error: "Use no máximo 5.000 caracteres." }),
  /** Vazio = post sem lição ligada. */
  lessonId: z.string(),
});

export type PostInput = z.infer<typeof postSchema>;
export type PostTagSlug = PostInput["tags"][number];

/** Confirma que um texto é uma das tags aceitas pelo formulário. */
export function isPostTagSlug(value: string): value is PostTagSlug {
  return postTagSlugs.some((slug) => slug === value);
}
