import { BLOB_MIN_CELLS, BLOB_MIN_RATIO, CHARS, INK_MIN, NEIGHBORS } from "./constants";
import { lightnessAt } from "./color";
import type { AsciiScene, Grid } from "./types";

/** Escolhe o caractere: mais "denso" onde a cor tem mais tinta; começa em "=": só caracteres cheios. */
export function pickChar(lum: number, ink: number) {
  const k = Math.min(CHARS.length - 1, 4 + Math.floor((1 - lum) * 4 + ink * 2 + Math.random() * 1.5));
  return CHARS[k];
}

/** Realce de borda: luminosidade do ponto menos a média dos vizinhos com tinta. */
export function edgeDetail(scene: AsciiScene, g: Grid, d: Uint8ClampedArray, gx: number, gy: number) {
  let sum = 0;
  let n = 0;
  for (let k = 0; k < NEIGHBORS.length; k += 2) {
    const x = gx + NEIGHBORS[k];
    const y = gy + NEIGHBORS[k + 1];
    if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) continue;
    const i = (y * g.cols + x) * 4;
    if (scene.inkOf(d[i], d[i + 1], d[i + 2]) < INK_MIN) continue;
    sum += lightnessAt(d, i);
    n++;
  }
  return n ? lightnessAt(d, (gy * g.cols + gx) * 4) - sum / n : 0;
}

/**
 * Cria o marcador de manchas grandes. Os buffers são refeitos só quando a
 * grade muda de tamanho.
 */
export function createBlobMask() {
  let lit = new Uint8Array(0);
  let labels = new Int32Array(0);
  let stack = new Int32Array(0);
  let keep = new Uint8Array(0);

  /** Marca as células com tinta e guarda só as manchas grandes (vizinhança de 8). */
  return function bigBlobs(scene: AsciiScene, g: Grid, d: Uint8ClampedArray) {
    const n = g.cols * g.rows;
    if (lit.length !== n) {
      lit = new Uint8Array(n);
      labels = new Int32Array(n);
      stack = new Int32Array(n);
      keep = new Uint8Array(n);
    }
    for (let i = 0; i < n; i++) lit[i] = scene.inkOf(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) >= INK_MIN ? 1 : 0;
    labels.fill(0);
    const sizes = [0];
    let largest = 0;
    for (let i = 0; i < n; i++) {
      if (!lit[i] || labels[i]) continue;
      const id = sizes.length;
      let top = 0;
      let size = 0;
      stack[top++] = i;
      labels[i] = id;
      while (top) {
        const j = stack[--top];
        const x = j % g.cols;
        const y = (j / g.cols) | 0;
        size++;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
            const k = ny * g.cols + nx;
            if (lit[k] && !labels[k]) {
              labels[k] = id;
              stack[top++] = k;
            }
          }
      }
      sizes.push(size);
      if (size > largest) largest = size;
    }
    const min = Math.max(BLOB_MIN_CELLS, BLOB_MIN_RATIO * largest);
    for (let i = 0; i < n; i++) keep[i] = labels[i] && sizes[labels[i]] >= min ? 1 : 0;
    return keep;
  };
}
