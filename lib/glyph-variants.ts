/**
 * Vocabulário da troca de letras (herói, títulos e "potencial"): as variações
 * de fonte e de forma que uma letra pode assumir, o desenho de cada uma e o
 * ritmo das trocas. As contagens saem das próprias tabelas, então acrescentar
 * uma fonte ou forma é só acrescentar uma linha.
 */

/** Fontes da troca (classes literais: o Tailwind lê este arquivo). */
export const GLYPH_FONT_CLASSES = [
  "font-shuffle-serif italic font-normal",
  "font-shuffle-mono font-bold",
  "font-shuffle-pixel font-semibold",
  // Unbounded é bem larga: reduz para não invadir as letras vizinhas.
  "font-shuffle-wide font-bold scale-[0.8]",
  "font-display italic font-bold",
] as const;

/** Formas Bauhaus em viewBox 0 0 10 10: círculo, quadrado, triângulo, meio-círculo, cruz. */
export const GLYPH_SHAPE_PATHS = [
  "M5 0 A5 5 0 1 1 5 10 A5 5 0 1 1 5 0 Z",
  "M0.5 0.5 H9.5 V9.5 H0.5 Z",
  "M5 0 L10 10 L0 10 Z",
  "M0 9 A5 5 0 0 1 10 9 Z",
  "M3.5 0 H6.5 V3.5 H10 V6.5 H6.5 V10 H3.5 V6.5 H0 V3.5 H3.5 Z",
] as const;

/** Cores das formas, da paleta do hub. */
export const GLYPH_COLOR_CLASSES = ["fill-acao", "fill-pratica", "fill-comunidade", "fill-trilha"] as const;

export type GlyphVariant = { kind: "font"; font: number } | { kind: "shape"; shape: number; color: number };

/** null = a letra na fonte certa. */
export type GlyphState = GlyphVariant | null;

/** Intervalo entre trocas, em ms. */
export const GLYPH_TICK_MS = 85;
/** Chance de uma letra trocar a cada tique. */
export const GLYPH_CHANGE_CHANCE = 0.6;
/** Chance de a troca virar forma em vez de outra fonte. */
const SHAPE_CHANCE = 0.25;

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/** Sorteia uma variação: outra fonte ou, às vezes, uma forma colorida. */
export function randomVariant(): GlyphVariant {
  if (Math.random() < SHAPE_CHANCE) {
    return { kind: "shape", shape: randomInt(GLYPH_SHAPE_PATHS.length), color: randomInt(GLYPH_COLOR_CLASSES.length) };
  }
  return { kind: "font", font: randomInt(GLYPH_FONT_CLASSES.length) };
}

/** Uma palavra de um texto, com a posição dela e da primeira letra no texto inteiro. */
export type WordSlot = { word: string; wordIndex: number; letterStart: number; letterEnd: number };

/**
 * Numera palavras e letras de um texto de várias linhas: a contagem segue
 * pelo texto inteiro (não recomeça por palavra nem por linha), porque é assim
 * que os hooks de troca guardam o estado de cada letra.
 */
export function layoutWords(lines: readonly string[]) {
  let wordIndex = 0;
  let letterStart = 0;
  const slots: WordSlot[][] = lines.map((line) =>
    line
      .split(" ")
      .filter(Boolean)
      .map((word) => {
        const letterEnd = letterStart + Array.from(word).length;
        const slot = { word, wordIndex, letterStart, letterEnd };
        wordIndex += 1;
        letterStart = letterEnd;
        return slot;
      }),
  );
  return { slots, letterCount: letterStart };
}
