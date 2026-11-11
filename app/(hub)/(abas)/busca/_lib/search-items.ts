import { normalizeSearchText } from "@/lib/data/busca";
import { searchKinds, type SearchItem, type SearchKind } from "./search-types";

/** Mais curto que isso não busca (evita listar tudo com uma letra). */
export const MIN_QUERY_LENGTH = 2;

/** Quantos itens cada grupo mostra em "Tudo". */
export const GROUP_PREVIEW_LIMIT = 4;

export type SearchGroup = { kind: SearchKind; items: SearchItem[]; total: number };

/**
 * Procura todas as palavras do termo (sem acento) e ordena: título que começa
 * com o termo > título que contém > só no texto. Devolve por tipo.
 */
export function searchItems(items: SearchItem[], rawQuery: string): Record<SearchKind, SearchItem[]> | null {
  const query = normalizeSearchText(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return null;
  const words = query.split(/\s+/).filter(Boolean);

  const scored = items
    .filter((item) => words.every((word) => item.haystack.includes(word)))
    .map((item) => {
      const title = normalizeSearchText(item.title);
      const score = title.startsWith(query) ? 3 : title.includes(query) ? 2 : words.some((word) => title.includes(word)) ? 1 : 0;
      return { item, score };
    })
    .sort((first, second) => second.score - first.score);

  const grouped = Object.fromEntries(searchKinds.map((kind) => [kind, [] as SearchItem[]])) as Record<SearchKind, SearchItem[]>;
  for (const { item } of scored) grouped[item.kind].push(item);
  return grouped;
}

/** Partes do texto, marcando as que casam com alguma palavra do termo (ignora acentos). */
export function splitHighlight(text: string, rawQuery: string): { text: string; isMatch: boolean }[] {
  const words = normalizeSearchText(rawQuery).split(/\s+/).filter((word) => word.length >= MIN_QUERY_LENGTH);
  if (words.length === 0) return [{ text, isMatch: false }];

  // Normaliza letra a letra para manter os índices do texto original.
  const normalized = [...text].map((char) => normalizeSearchText(char) || char).join("");
  if (normalized.length !== text.length) return [{ text, isMatch: false }];

  const marks = new Array<boolean>(text.length).fill(false);
  for (const word of words) {
    let index = normalized.indexOf(word);
    while (index !== -1) {
      for (let offset = 0; offset < word.length; offset += 1) marks[index + offset] = true;
      index = normalized.indexOf(word, index + word.length);
    }
  }

  const parts: { text: string; isMatch: boolean }[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const last = parts.at(-1);
    if (last && last.isMatch === marks[index]) last.text += text[index];
    else parts.push({ text: text[index], isMatch: marks[index] });
  }
  return parts;
}
