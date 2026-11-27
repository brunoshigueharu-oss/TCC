import { easeInOutCubic } from "../motion";
import { MORPH, SCRAMBLE } from "./constants";
import { pushGlyph, type Glyph, type GlyphList } from "./glyph-list";
import { buildNearest } from "./nearest";
import type { Morph, MorphParticle } from "./types";

/**
 * Casa cada letra da cena velha com a letra mais próxima da nova, comparando
 * as duas silhuetas esticadas para a mesma caixa (o rabo do peixe vai para a
 * ponta do gato, a cabeça para a cabeça). Letras novas que ninguém pegou saem
 * da letra velha mais próxima. Sem uma das cenas, as letras só aparecem/somem.
 */
export function pairGlyphs(from: Glyph[], to: Glyph[], cell: number): MorphParticle[] {
  const particle = (a: Glyph, b: Glyph, sourceX: number): MorphParticle => {
    const angle = Math.random() * Math.PI * 2;
    const scatter = Math.random() * MORPH.scatter * cell;
    return {
      from: a,
      to: b,
      // partida da esquerda para a direita, com ruído: parece uma onda que mistura as letras
      delay: MORPH.spread * (0.55 * Math.random() + 0.45 * sourceX),
      jx: Math.cos(angle) * scatter,
      jy: Math.sin(angle) * scatter,
      ch: a.ch,
    };
  };
  if (!from.length) return to.map((b) => particle({ ...b, a: 0 }, b, Math.random()));
  if (!to.length) return from.map((a) => particle(a, { ...a, a: 0 }, Math.random()));

  const box = (list: Glyph[]) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const { x, y } of list) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    return list.map(({ x, y }) => [(x - minX) / w, (y - minY) / h] as const);
  };
  const nFrom = box(from);
  const nTo = box(to);
  const nearestTo = buildNearest(nTo);
  const nearestFrom = buildNearest(nFrom);

  const particles: MorphParticle[] = [];
  const isTaken = new Uint8Array(to.length);
  for (let i = 0; i < from.length; i++) {
    const j = nearestTo(nFrom[i]);
    isTaken[j] = 1;
    particles.push(particle(from[i], to[j], nFrom[i][0]));
  }
  for (let j = 0; j < to.length; j++) {
    if (isTaken[j]) continue;
    const i = nearestFrom(nTo[j]);
    particles.push(particle(from[i], to[j], nFrom[i][0]));
  }
  return particles;
}

/** Letras em voo: posição, cor, opacidade e caractere misturados de uma cena para a outra. */
export function renderMorph(m: Morph, k: number, out: GlyphList, alpha: number) {
  // todas pousam antes da passagem final: nela, a cena nova assume com as letras já no lugar
  const flight = k / (1 - MORPH.handoff);
  const travel = 1 - MORPH.spread;
  for (const p of m.particles) {
    const u = Math.min(1, Math.max(0, (flight - p.delay) / travel));
    const e = easeInOutCubic(u);
    const { from, to } = p;
    // desvia do caminho reto no meio do voo: as letras se espalham e se misturam
    const bend = Math.sin(Math.PI * e);
    if (e <= 0.12) p.ch = from.ch;
    else if (e >= 0.88) p.ch = to.ch;
    else if (Math.random() < 0.3) p.ch = SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
    pushGlyph(
      out,
      from.x + (to.x - from.x) * e + p.jx * bend,
      from.y + (to.y - from.y) * e + p.jy * bend,
      p.ch,
      Math.round(from.r + (to.r - from.r) * e),
      Math.round(from.g + (to.g - from.g) * e),
      Math.round(from.b + (to.b - from.b) * e),
      (from.a + (to.a - from.a) * e) * alpha,
      // cada cena tem o próprio tamanho de letra: muda aos poucos durante o voo
      from.size + (to.size - from.size) * e,
      -1,
    );
  }
}
