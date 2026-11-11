export const searchKinds = ["licoes", "cursos", "posts", "pessoas"] as const;
export type SearchKind = (typeof searchKinds)[number];
export type SearchFilter = SearchKind | "tudo";

export type SearchItem = {
  kind: SearchKind;
  id: string;
  title: string;
  meta: string;
  href: string;
  /** Texto normalizado (minúsculas, sem acento) onde o termo é procurado. */
  haystack: string;
};

export type SearchData = {
  items: SearchItem[];
  suggestions: string[];
  tags: { slug: string; postsCount: number }[];
};

export const kindLabels: Record<SearchKind, string> = {
  licoes: "Lições",
  cursos: "Minicursos",
  posts: "Posts",
  pessoas: "Pessoas",
};
