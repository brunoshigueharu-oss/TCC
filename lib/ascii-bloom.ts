/**
 * Flor desabrochando desenhada com caracteres (porte do protótipo
 * `prototipos/pontilhismo`, temas "gerbera", "flor" (lírio) e "florescer",
 * estilo "Caracteres", cores originais, trecho "Abrir e fechar"). Fundo da
 * página branco por padrão, ou escuro com `page: "dark"`.
 *
 * Ciclo: botão parado enquanto os caracteres entram (pincelada) → desabrocha →
 * fica aberta → fecha → pausa fechada → recomeça, balançando de leve.
 * O desenho em si fica em `ascii-engine`.
 */

import { FRAME_SECONDS, startAsciiScene, vividHsl, type AsciiScene, type Pose, type Rgb } from "./ascii-engine";

type BloomPreset = {
  /** Largura dos quadros guardados (a altura segue a proporção do vídeo). */
  frameWidth: number;
  /** Trecho usado do vídeo (s): do botão fechado à flor aberta. */
  clip: { from: number; to: number };
  /** Recorte do quadro, em fração do vídeo. */
  crop: { x: number; y: number; w: number; h: number };
  /** Cor do fundo do vídeo, usada fora do quadro. */
  fill: string;
  /** Tinta = saturação: abaixo de `min` não desenha; `min + range` já é tinta cheia. */
  ink: { min: number; range: number };
  /** Luminosidade do vídeo (p5–p95) → faixa no fundo branco. */
  tone: readonly [number, number];
};

/** Valores medidos sobre cada vídeo no protótipo. */
const PRESETS = {
  // vídeo quadrado; fundo branco puro (~0,02) e pétalas bem claras (a partir de ~0,05)
  gerbera: {
    frameWidth: 320,
    clip: { from: 0.02, to: 5.05 },
    crop: { x: 0, y: 0, w: 1, h: 1 },
    fill: "#fefefe",
    ink: { min: 0.045, range: 0.05 },
    tone: [0.4, 0.95],
  },
  // vídeo em retrato (2:3); fundo rosado (~0,05) e pétalas em 0,4–0,6. Em ~4,3 s
  // o vídeo corta para outra cena, então nada depois disso é usado
  lirio: {
    frameWidth: 256,
    clip: { from: 0.02, to: 4.26 },
    crop: { x: 0, y: 0.03, w: 1, h: 0.97 },
    fill: "#fbf5f4",
    ink: { min: 0.2, range: 0.1 },
    tone: [0.35, 0.8],
  },
  // vídeo 752×528 (5,08 s, sem cortes); fundo branco puro (~0,04). A flor fica
  // à esquerda, então o recorte descarta a faixa vazia da direita
  florescer: {
    frameWidth: 300,
    clip: { from: 0.02, to: 4.77 },
    crop: { x: 0.03, y: 0, w: 0.709, h: 1 },
    fill: "#ffffff",
    ink: { min: 0.04, range: 0.04 },
    tone: [0.65, 0.88],
  },
} satisfies Record<string, BloomPreset>;

export type BloomFlower = keyof typeof PRESETS;

const BLOOM = {
  budMs: 2600, // botão parado enquanto os caracteres entram
  speed: 0.7, // abrir: velocidade do vídeo (< 1 = mais lento)
  openMs: 2200, // aberta
  closeMs: 3200, // fechando
  closedMs: 900, // fechada antes de abrir de novo
  sway: 0.022, // balanço (rad) em volta da base do caule
  swayMs: 3100,
};

/** Saturação e força do realce de borda entre pétalas. */
const VIVID = { sat: 1.9, edge: 2.5 } as const;
/** Faixa de luminosidade do caractere conforme o fundo da página. */
const RANGE = { light: [0.24, 0.56], dark: [0.42, 0.72] } as const;
/**
 * Fundo escuro: o contorno da flor no vídeo é cor misturada com o branco
 * (clara e pouco saturada) e no preto parece uma borda. Pede mais tinta
 * (`ink.min` sobe `inkShift` × `ink.range`) para deixá-lo de fora.
 */
const DARK = { inkShift: 1 } as const;

/** Fundo da página atrás do canvas (o canvas é transparente). */
export type BloomPage = keyof typeof RANGE;
/** Cinza frio: brilhos sem cor não somem no fundo branco. */
const NEUTRAL = [201, 204, 216] as const;

export type AsciiBloomOptions = {
  /** Qual flor: define recorte, tinta e tom medidos para o vídeo dela. */
  flower: BloomFlower;
  /** URL do vídeo da flor. */
  src: string;
  /** Fundo da página: claro (padrão) ou escuro. */
  page?: BloomPage;
};

const easeInOut = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

/** Brilho quase sem cor vira cinza frio, para não sumir no fundo branco. */
function neutralizeHighlights(rgb: Rgb) {
  const lum = (0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]) / 255;
  const mx = Math.max(rgb[0], rgb[1], rgb[2]);
  const sat = (mx - Math.min(rgb[0], rgb[1], rgb[2])) / (mx || 1);
  if (lum <= 0.7 || sat >= 0.18) return;
  const shade = (1 - lum) * 120;
  rgb[0] = Math.round(NEUTRAL[0] - shade);
  rgb[1] = Math.round(NEUTRAL[1] - shade);
  rgb[2] = Math.round(NEUTRAL[2] - shade);
}

function bloomScene(preset: BloomPreset, page: BloomPage): AsciiScene {
  const { clip, ink } = preset;
  const len = clip.to - clip.from;
  const playMs = (len / BLOOM.speed) * 1000;
  const cycle = playMs + BLOOM.openMs + BLOOM.closeMs + BLOOM.closedMs;
  const isDark = page === "dark";
  const vivid = { ...VIVID, tone: preset.tone, range: RANGE[page] };
  const inkMin = isDark ? ink.min + DARK.inkShift * ink.range : ink.min;

  return {
    frameWidth: preset.frameWidth,
    // guarda um quadro a mais para misturar com o último do trecho
    capture: { from: clip.from, to: clip.to + FRAME_SECONDS },
    crop: preset.crop,
    background: preset.fill,
    cell: { min: 6, divisor: 64 },
    fit: 0.94,
    isDarkBackground: isDark,
    // vídeo de fundo claro: tinta = saturação. Só o colorido vira caractere; brilhos e sombras cinzas ficam de fora
    inkOf(r, g, b) {
      const mx = Math.max(r, g, b) / 255;
      const mn = Math.min(r, g, b) / 255;
      const sat = mx > 0 ? (mx - mn) / mx : 0;
      return Math.min(1, Math.max(0, (sat - inkMin) / ink.range));
    },
    color(r, g, b, detail, out) {
      vividHsl(r, g, b, detail, vivid, out);
      // no fundo escuro o brilho claro já aparece; só no branco vira cinza
      if (!isDark) neutralizeHighlights(out);
    },
    staticPose: { t: clip.to, rot: 0 },
    createClock: () => (now, elapsedMs): Pose => {
      const rot = BLOOM.sway * (Math.sin((now / BLOOM.swayMs) * 6.283) + 0.35 * Math.sin((now / (BLOOM.swayMs * 0.43)) * 6.283 + 1.3));
      const e = elapsedMs - BLOOM.budMs;
      if (e < 0) return { t: clip.from, rot };
      const c = e % cycle;
      if (c < playMs) return { t: clip.from + (c / 1000) * BLOOM.speed, rot };
      if (c < playMs + BLOOM.openMs) return { t: clip.to, rot };
      if (c < playMs + BLOOM.openMs + BLOOM.closeMs) return { t: clip.to - len * easeInOut((c - playMs - BLOOM.openMs) / BLOOM.closeMs), rot };
      return { t: clip.from, rot };
    },
  };
}

/**
 * Liga a animação no canvas. Devolve a função que desliga tudo (quadros
 * guardados, observadores e o laço de desenho).
 */
export function startAsciiBloom(canvas: HTMLCanvasElement, { flower, src, page = "light" }: AsciiBloomOptions) {
  return startAsciiScene(canvas, bloomScene(PRESETS[flower], page), src);
}
