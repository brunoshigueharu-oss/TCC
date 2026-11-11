import type { CommandItem } from "@/lib/command-index";

/** Minúsculas e sem acento, para "licao" casar com "Lição". */
export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

const SCORE = {
  /** O termo aparece inteiro no texto. */
  substring: 100,
  /** ...e no começo do texto. */
  prefix: 60,
  /** ...ou no começo de uma palavra. */
  wordStart: 30,
  /** As letras aparecem em ordem, mas espalhadas ("cfg" → "configurações"). */
  subsequence: 20,
  /** Bônus por letra colada na anterior, na busca espalhada. */
  adjacent: 4,
} as const;

/** Na busca espalhada, o trecho casado pode ter no máximo N × o tamanho do termo. */
const MAX_SPREAD = 3;

/** Peso de cada campo: título vale mais que palavra-chave, que vale mais que contexto. */
const FIELD_WEIGHT = { label: 1, keyword: 0.7, hint: 0.5 } as const;

/** Pontua um termo (já normalizado) contra um texto (já normalizado). 0 = não casa. */
export function scoreTerm(term: string, text: string) {
  if (!term) return 0;
  const index = text.indexOf(term);

  if (index !== -1) {
    const isPrefix = index === 0;
    const isWordStart = !isPrefix && /[\s·—@#/-]/.test(text[index - 1]);
    // Textos curtos ganham um pouco: "Perfil" antes de "Perfil de Ana".
    const brevity = Math.max(0, 20 - text.length) * 0.2;
    return SCORE.substring + (isPrefix ? SCORE.prefix : isWordStart ? SCORE.wordStart : 0) + brevity;
  }

  // Busca espalhada só vale para termos com 3+ letras, senão tudo casa com tudo.
  if (term.length < 3) return 0;
  let position = -1;
  let first = -1;
  let adjacent = 0;
  for (const char of term) {
    const next = text.indexOf(char, position + 1);
    if (next === -1) return 0;
    if (first === -1) first = next;
    if (next === position + 1) adjacent += 1;
    position = next;
  }
  // Letras espalhadas demais ("cfg" em "Como faço ... grid") não contam.
  if (position - first + 1 > term.length * MAX_SPREAD) return 0;
  return SCORE.subsequence + adjacent * SCORE.adjacent;
}

type IndexedItem = { item: CommandItem; label: string; hint: string; keywords: string[] };

/** Normaliza os textos uma vez, quando a paleta monta. */
export function indexItems(items: CommandItem[]): IndexedItem[] {
  return items.map((item) => ({
    item,
    label: normalize(item.label),
    hint: normalize(item.hint ?? ""),
    keywords: item.keywords.map(normalize),
  }));
}

/**
 * Busca difusa: cada palavra da consulta precisa casar com algum campo do
 * item; a nota é a soma das melhores notas por palavra. Devolve do melhor para
 * o pior.
 */
export function searchItems(indexed: IndexedItem[], query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: { item: CommandItem; score: number }[] = [];

  for (const entry of indexed) {
    let total = 0;
    let isMatch = true;

    for (const term of terms) {
      const best = Math.max(
        scoreTerm(term, entry.label) * FIELD_WEIGHT.label,
        scoreTerm(term, entry.hint) * FIELD_WEIGHT.hint,
        ...entry.keywords.map((keyword) => scoreTerm(term, keyword) * FIELD_WEIGHT.keyword),
      );
      if (best === 0) {
        isMatch = false;
        break;
      }
      total += best;
    }

    if (isMatch) results.push({ item: entry.item, score: total });
  }

  return results.sort((first, second) => second.score - first.score);
}

/**
 * Trecho do rótulo que casa com a consulta inteira (para destacar). Compara
 * sem acento, mas devolve posições do texto original — só é seguro quando a
 * normalização não muda o comprimento.
 */
export function findHighlight(label: string, query: string): [number, number] | null {
  const normalizedLabel = normalize(label);
  const term = normalize(query);
  if (!term || normalizedLabel.length !== label.trim().length) return null;
  const index = normalizedLabel.indexOf(term);
  if (index === -1) return null;
  const offset = label.length - label.trimStart().length;
  return [index + offset, index + offset + term.length];
}
