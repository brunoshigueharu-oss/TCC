import { z } from "zod";

/**
 * Dados FICTÍCIOS que a Busca consulta além da trilha, dos minicursos e dos
 * posts da comunidade: pessoas, tags e sugestões. Na versão real a busca é um endpoint da API.
 */

const searchPersonSchema = z.object({
  username: z.string(),
  name: z.string(),
  role: z.string(),
  level: z.number().int().positive(),
});

const searchIndexSchema = z.object({
  people: z.array(searchPersonSchema),
  tags: z.array(z.string()),
  /** Sugestões mostradas com o campo vazio. */
  suggestions: z.array(z.string()).min(1),
});

export type SearchPerson = z.infer<typeof searchPersonSchema>;
export type SearchIndex = z.infer<typeof searchIndexSchema>;

export const searchIndex: SearchIndex = searchIndexSchema.parse({
  people: [
    { username: "rafael", name: "Rafael Souza", role: "Designer de produto", level: 6 },
    { username: "ana", name: "Ana Lima", role: "Designer de sistemas", level: 5 },
    { username: "caio", name: "Caio Martins", role: "Designer de interfaces", level: 2 },
    { username: "julia", name: "Júlia Rocha", role: "Designer de interação", level: 4 },
    { username: "pedro", name: "Pedro Nunes", role: "Estudante de design", level: 1 },
  ],
  tags: ["prompts", "layout", "componentes", "estado", "acessibilidade", "ferramentas"],
  suggestions: ["prompt", "grid", "acessibilidade", "tokens", "estado", "Figma"],
});

/** Minúsculas e sem acento, para "Lição" casar com "licao". */
export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
