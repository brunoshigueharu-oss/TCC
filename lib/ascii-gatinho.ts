/**
 * Gatinho desenhado com caracteres (porte do protótipo `prototipos/pontilhismo`,
 * tema "Gatinho 2" (`gatinho2.mp4`), estilo "Caracteres", em fundo preto).
 * O vídeo é de um gato cinza, que some no preto: as cores vêm de um degradê
 * de gato malhado marrom (`GRADIENT`), não do vídeo.
 *
 * Vai e volta: o vídeo não emenda sozinho (o fim não volta à pose do começo).
 * O desenho em si fica em `ascii-engine`.
 */

import { startAsciiScene, type AsciiScene, type Rgb } from "./ascii-engine";

/** Trecho usado do vídeo (s): 5,04 s, 528×720 (retrato). */
const CLIP = { from: 0, to: 5 };
/** Luminosidade do vídeo (p5–p95) e força do realce de borda. */
const TONE = { range: [0.339, 0.82], edge: 2.5 } as const;
/**
 * Tom do vídeo (0 = listra escura, 1 = pelo claro) → cor de gato malhado
 * marrom: chocolate nas listras, caramelo no meio-tom, creme no pelo claro.
 * O chocolate é mais claro que o de verdade para não sumir no fundo preto.
 */
const GRADIENT: readonly (readonly [number, Rgb])[] = [
  [0, [90, 54, 32]], // chocolate #5a3620
  [0.45, [160, 106, 60]], // caramelo #a06a3c
  [0.8, [220, 174, 116]], // bege #dcae74
  [1, [246, 231, 204]], // creme #f6e7cc
];

/** Cor do degradê na posição `u` (0–1). Escreve em `out`. */
function gradientAt(u: number, out: Rgb) {
  for (let i = 1; i < GRADIENT.length; i++) {
    const [p1, c1] = GRADIENT[i];
    if (u > p1 && i < GRADIENT.length - 1) continue;
    const [p0, c0] = GRADIENT[i - 1];
    const k = Math.min(1, Math.max(0, (u - p0) / (p1 - p0)));
    for (let j = 0; j < 3; j++) out[j] = Math.round(c0[j] + (c1[j] - c0[j]) * k);
    return;
  }
}

export type AsciiGatinhoOptions = {
  /** URL do vídeo do gatinho. */
  src: string;
};

/** Vai e volta: posição em `[0, length]` depois de `seconds` segundos. */
function pingPong(seconds: number, length: number) {
  const u = (seconds % (2 * length)) / length;
  return (u < 1 ? u : 2 - u) * length;
}

const GATINHO_SCENE: AsciiScene = {
  frameWidth: 256,
  capture: CLIP,
  crop: { x: 0.224, y: 0.049, w: 0.734, h: 0.93 },
  // fundo do vídeo: branco puro (tinta 0)
  background: "#fff",
  cell: { min: 7, divisor: 80 },
  // retrato: deixa folga em cima (logo) e embaixo
  fit: 0.78,
  isDarkBackground: true,
  /**
   * Gato malhado cinza em fundo branco: saturação não pega o pelo, então
   * tinta = distância do branco (medido: min 0,06, range 0,12).
   */
  inkOf(r, g, b) {
    const dark = 1 - Math.min(r, g, b) / 255;
    return Math.min(1, Math.max(0, (dark - 0.06) / 0.12));
  },
  color(r, g, b, detail, out) {
    // luminosidade HSL remapeada para 0–1; `detail` reforça as bordas das listras
    const lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 510;
    const [lo, hi] = TONE.range;
    const u = (lightness - lo) / (hi - lo) + (detail / (hi - lo)) * TONE.edge;
    gradientAt(Math.min(1, Math.max(0, u)), out);
  },
  staticPose: { t: CLIP.from, rot: 0 },
  createClock() {
    return (_now, elapsedMs, { lastFrameT }) => {
      const t = CLIP.from + pingPong(elapsedMs / 1000, CLIP.to - CLIP.from);
      // carregando: espera no último quadro guardado
      return { t: Math.min(t, lastFrameT), rot: 0 };
    };
  },
};

/**
 * Liga a animação no canvas. Devolve a função que desliga tudo (quadros
 * guardados, observadores e o laço de desenho).
 */
export function startAsciiGatinho(canvas: HTMLCanvasElement, { src }: AsciiGatinhoOptions) {
  return startAsciiScene(canvas, GATINHO_SCENE, src);
}
