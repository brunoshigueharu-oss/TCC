import type { Rgb } from "./types";

export type VividOptions = {
  /** Multiplica a saturação. */
  sat: number;
  /** Luminosidade do vídeo (p5–p95)… */
  tone: readonly [number, number];
  /** …remapeada para esta faixa no fundo da página. */
  range: readonly [number, number];
  /** Força do realce de borda. */
  edge: number;
};

/** Luminosidade HSL (0–1) do pixel `i` em dados RGBA. */
export const lightnessAt = (d: Uint8ClampedArray, i: number) =>
  (Math.max(d[i], d[i + 1], d[i + 2]) + Math.min(d[i], d[i + 1], d[i + 2])) / 510;

function hueToChannel(p: number, q: number, t: number) {
  t = (t + 1) % 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/** Cores mais vivas (HSL) e tom remapeado para o fundo da página; `detail` reforça bordas. Escreve em `out`. */
export function vividHsl(r8: number, g8: number, b8: number, detail: number, { sat, tone, range, edge }: VividOptions, out: Rgb) {
  const r = r8 / 255;
  const g = g8 / 255;
  const b = b8 / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let h = 0;
  let l = (mx + mn) / 2;
  let s = mx === mn ? 0 : (mx - mn) / (l > 0.5 ? 2 - mx - mn : mx + mn);
  if (mx !== mn) {
    const d = mx - mn;
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  s = Math.min(1, s * sat);
  const [lo, hi] = tone;
  const u = Math.min(1, Math.max(0, (l - lo) / (hi - lo) + (detail / (hi - lo)) * edge));
  l = range[0] + u * (range[1] - range[0]);
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  out[0] = Math.round(hueToChannel(p, q, h + 1 / 3) * 255);
  out[1] = Math.round(hueToChannel(p, q, h) * 255);
  out[2] = Math.round(hueToChannel(p, q, h - 1 / 3) * 255);
}
