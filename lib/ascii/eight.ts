import { EIGHT, MOUSE_RADIUS } from "./constants";
import type { EightSlot, Grid, Mouse } from "./types";

/** Vagas do 8 (duas voltas empilhadas), espaçadas de `step` px e centradas no mouse. */
export function buildEightSlots(step: number): EightSlot[] {
  const rt = MOUSE_RADIUS * EIGHT.top;
  const rb = MOUSE_RADIUS * EIGHT.bottom;
  // cruzamento um pouco acima do mouse (a volta de baixo é maior), para o 8 ficar centrado
  const cross = rt - rb;
  const loops = [
    { cy: cross - rt, r: rt },
    { cy: cross + rb, r: rb },
  ];
  const slots: EightSlot[] = [];
  for (const { cy, r } of loops) {
    const count = Math.max(6, Math.round((2 * Math.PI * r) / step));
    // o topo da volta de baixo é o mesmo ponto do pé da volta de cima: pula para não dobrar a vaga
    for (let k = 0; k < count; k++) {
      const angle = Math.PI / 2 + (2 * Math.PI * k) / count;
      const x = r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (cy > cross && k === Math.round(count / 2)) continue;
      slots.push({ x, y });
    }
  }
  return slots;
}

/** Letra perto do mouse ainda sem vaga: índice na grade e distância² da casa dela ao mouse. */
export type EightCandidate = { index: number; dist2: number };

/**
 * Distribui as vagas livres do 8: as letras mais perto do mouse escolhem
 * primeiro, cada uma a vaga livre mais próxima de onde está agora.
 * Elas começam a andar no próximo quadro.
 */
export function fillEightSlots(g: Grid, mouse: Mouse, candidates: EightCandidate[]) {
  let free = 0;
  for (let s = 0; s < g.slotOwner.length; s++) if (g.slotOwner[s] < 0) free++;
  if (!free) return;
  candidates.sort((a, b) => a.dist2 - b.dist2);
  for (const { index } of candidates) {
    const p = g.particles[index];
    let best = -1;
    let bestDist2 = Infinity;
    for (let s = 0; s < g.slots.length; s++) {
      if (g.slotOwner[s] >= 0) continue;
      const sx = mouse.x + g.slots[s].x - p.x;
      const sy = mouse.y + g.slots[s].y - p.y;
      const dist2 = sx * sx + sy * sy;
      if (dist2 < bestDist2) {
        bestDist2 = dist2;
        best = s;
      }
    }
    g.slotOwner[best] = index;
    p.slot = best;
    if (--free === 0) return;
  }
}
