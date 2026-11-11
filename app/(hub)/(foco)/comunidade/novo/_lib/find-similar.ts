import type { PostTeaser } from "@/lib/data/comunidade";

/** Palavras curtas e comuns que não dizem nada sobre o assunto. */
const STOPWORDS = new Set([
  "como", "para", "pela", "pelo", "porque", "quando", "qual", "quais", "que", "isso", "esse", "essa",
  "este", "esta", "uma", "umas", "uns", "com", "sem", "mais", "menos", "faço", "fazer", "vocês",
  "minha", "meu", "sobre", "ainda", "também", "depois", "antes", "tenho", "está", "estou",
]);

/** Menos que isso no título não procura (evita sugestões aleatórias). */
const MIN_TITLE_LENGTH = 8;

function tokenize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !STOPWORDS.has(word));
}

/** Prefixo de 5 letras: "componente" casa com "componentes", "prompt" com "prompts". */
function stem(word: string) {
  return word.slice(0, 5);
}

/**
 * "Dúvidas parecidas" enquanto a pessoa escreve: pontua cada post pelas
 * palavras do título em comum (e um pouco pelas tags escolhidas). Roda no
 * navegador sobre a lista enxuta de posts; na versão real seria uma busca
 * semântica na API.
 */
export function findSimilarPosts(title: string, tags: string[], posts: PostTeaser[], limit = 3) {
  if (title.trim().length < MIN_TITLE_LENGTH) return [];
  const words = new Set(tokenize(title).map(stem));
  if (words.size === 0) return [];

  return posts
    .map((post) => {
      const shared = tokenize(post.title).filter((word) => words.has(stem(word))).length;
      const sharedTags = post.tags.filter((tag) => tags.includes(tag)).length;
      return { post, score: shared * 2 + (shared > 0 ? sharedTags : 0) };
    })
    .filter(({ score }) => score >= 2)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map(({ post }) => post);
}
