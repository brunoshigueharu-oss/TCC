import { z } from "zod";

/**
 * Dados FICTÍCIOS que a Busca consulta além da trilha e dos minicursos: posts
 * da comunidade, pessoas e tags. Na versão real a busca é um endpoint da API.
 */

const searchPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  context: z.string(),
  answers: z.number().int().nonnegative(),
  keywords: z.array(z.string()),
});

const searchPersonSchema = z.object({
  username: z.string(),
  name: z.string(),
  role: z.string(),
  level: z.number().int().positive(),
});

const searchIndexSchema = z.object({
  posts: z.array(searchPostSchema),
  people: z.array(searchPersonSchema),
  tags: z.array(z.string()),
  /** Sugestões mostradas com o campo vazio. */
  suggestions: z.array(z.string()),
});

export type SearchPost = z.infer<typeof searchPostSchema>;
export type SearchPerson = z.infer<typeof searchPersonSchema>;
export type SearchIndex = z.infer<typeof searchIndexSchema>;

export const searchIndex: SearchIndex = searchIndexSchema.parse({
  posts: [
    {
      id: "grid-layout",
      title: "Como faço a IA respeitar meu grid?",
      context: "Lição 03",
      answers: 3,
      keywords: ["layout", "grid", "prompt", "colunas"],
    },
    {
      id: "estado-componente",
      title: "Por que o componente perdeu o estado ao trocar de tela?",
      context: "Lição 02",
      answers: 0,
      keywords: ["estado", "componentes", "navegação"],
    },
    {
      id: "prompt-mobile",
      title: "O prompt de exemplo funciona no mobile também?",
      context: "Lição 03",
      answers: 1,
      keywords: ["prompt", "mobile", "responsivo", "layout"],
    },
  ],
  people: [
    { username: "rafael", name: "Rafael Souza", role: "Designer de produto", level: 6 },
    { username: "ana", name: "Ana Lima", role: "Designer de sistemas", level: 5 },
    { username: "caio", name: "Caio Martins", role: "Designer de interfaces", level: 2 },
    { username: "julia", name: "Júlia Rocha", role: "Designer de interação", level: 4 },
    { username: "pedro", name: "Pedro Nunes", role: "Estudante de design", level: 1 },
  ],
  tags: ["prompts", "layout", "componentes", "estado", "acessibilidade", "ferramentas"],
  suggestions: ["prompt", "layout", "estado", "tokens", "Figma"],
});

/** Minúsculas e sem acento, para "Lição" casar com "licao". */
export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
