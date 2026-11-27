import { EIGHT, INK_MIN } from "./constants";
import { buildEightSlots } from "./eight";
import { sampleLayer } from "./sample";
import type { Grid, Layer, Particle } from "./types";

/** Ordem de entrada "pincelada": percorre a mancha por vizinhança (BFS), como um pincel passando. */
function orderStroke(pts: Particle[], index: Int32Array, cols: number, rows: number) {
  if (!pts.length) return;
  const dist = new Float32Array(pts.length).fill(-1);
  const byX = pts.map((_, i) => i).sort((a, b) => pts[a].gx - pts[b].gx);
  let base = 0;
  for (const seed of byX) {
    if (dist[seed] >= 0) continue;
    const queue = [seed];
    dist[seed] = base;
    let maxD = base;
    for (let h = 0; h < queue.length; h++) {
      const p = pts[queue[h]];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = p.gx + dx;
          const ny = p.gy + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const n = index[ny * cols + nx];
          if (n >= 0 && dist[n] < 0) {
            dist[n] = dist[queue[h]] + 1;
            if (dist[n] > maxD) maxD = dist[n];
            queue.push(n);
          }
        }
    }
    base = maxD * 0.6; // manchas soltas começam antes da anterior terminar
  }
  let mx = 0;
  pts.forEach((p, i) => {
    p.order = dist[i] + Math.random() * 4;
    mx = Math.max(mx, p.order);
  });
  pts.forEach((p) => (p.order /= mx || 1));
}

/** Monta a grade de células da cena no palco `width` x `height` (px); `null` se ainda não dá. */
export function buildGrid(layer: Layer, start: number, width: number, height: number): Grid | null {
  const first = layer.frames[0];
  const { scene } = layer;
  // caractere proporcional ao palco, com piso para continuar legível em telas menores
  const cell = Math.max(scene.cell.min, Math.round(Math.min(width, height) / scene.cell.divisor));
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  if (!first || cols < 2 || rows < 2) return null;
  const crop = scene.crop ?? { x: 0, y: 0, w: 1, h: 1 };
  const fw = first.bmp.width * crop.w;
  const fh = first.bmp.height * crop.h;
  const s = Math.min((width * scene.fit) / fw, (height * scene.fit) / fh);
  const cnv = document.createElement("canvas");
  cnv.width = cols;
  cnv.height = rows;
  const cx = cnv.getContext("2d", { willReadFrequently: true });
  if (!cx) return null;
  cx.imageSmoothingQuality = "high";
  const dw = (fw * s) / cell;
  const dh = (fh * s) / cell;
  const ox = (width - cols * cell) / 2;
  const oy = (height - rows * cell) / 2;
  const slots = buildEightSlots(cell * EIGHT.spacing);
  const g: Grid = {
    cols,
    rows,
    cell,
    cx,
    src: [crop.x * first.bmp.width, crop.y * first.bmp.height, fw, fh],
    dst: [(cols - dw) / 2, (rows - dh) / 2, dw, dh],
    start,
    particles: [],
    slots,
    slotOwner: new Int32Array(slots.length),
  };
  const d = sampleLayer(layer, g, { t: first.t, rot: 0 });
  // entrada pela silhueta do primeiro quadro; o resto (o que surge depois) aparece no fim
  const index = new Int32Array(cols * rows).fill(-1);
  const litParticles: Particle[] = [];
  const rest: Particle[] = [];
  for (let gy = 0; gy < rows; gy++)
    for (let gx = 0; gx < cols; gx++) {
      const i = (gy * cols + gx) * 4;
      const tx = ox + gx * cell + cell / 2;
      const ty = oy + gy * cell + cell / 2;
      const p: Particle = { gx, gy, tx, ty, x: tx, y: ty, order: 1, ink: 0, lum: 0.5, ch: "", vx: 0, vy: 0, ox: 0, oy: 0, slot: -1 };
      if (scene.inkOf(d[i], d[i + 1], d[i + 2]) >= INK_MIN) {
        index[gy * cols + gx] = litParticles.length;
        litParticles.push(p);
      } else rest.push(p);
    }
  orderStroke(litParticles, index, cols, rows);
  rest.forEach((p) => (p.order = 0.85 + Math.random() * 0.15));
  g.particles = litParticles.concat(rest);
  return g;
}
