import { EACH_MS, EIGHT, INK_MIN, MOUSE_RADIUS, REVEAL_MS } from "./constants";
import { fillEightSlots, type EightCandidate } from "./eight";
import { pushGlyph, type GlyphList } from "./glyph-list";
import { createBlobMask, edgeDetail, pickChar } from "./ink";
import { sampleLayer } from "./sample";
import type { Grid, Layer, Mouse, Pose, Rgb } from "./types";

/** Entrada: 0 → 1 com saída suave. */
export const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

/** Empurrão do mouse nas letras soltas: força, amortecimento da velocidade e quanto do desvio a mola mantém por quadro. */const PUSH_FORCE = 2.2;
const PUSH_DAMPING = 0.86;
const SPRING_KEEP = 0.9;
/** Chance por quadro de uma letra parada trocar de caractere (cintilar). */
const FLICKER_CHANCE = 0.004;
/** Mudança de tinta/luminosidade que obriga a escolher o caractere de novo. */
const REPICK_INK = 0.25;
const REPICK_LUM = 0.2;

/**
 * Cria o desenhista de cenas: calcula as letras de uma cena a cada quadro,
 * lendo o mouse (ímã do 8 e empurrão) e guardando buffers reaproveitados.
 */
export function createLayerRenderer(isReducedMotion: boolean, mouse: Mouse) {
  const rgb: Rgb = [0, 0, 0];
  const bigBlobs = createBlobMask();

  function currentPose(layer: Layer, g: Grid, now: number): Pose {
    const { frames, isCaptured, scene } = layer;
    const lastFrameT = frames[frames.length - 1].t;
    const pose = isReducedMotion ? scene.staticPose : layer.clock(now, Math.max(0, now - g.start), { isCaptured, lastFrameT });
    // durante a captura, o tempo não passa do último quadro guardado
    return isCaptured ? pose : { t: Math.min(pose.t, lastFrameT), rot: pose.rot };
  }

  /**
   * Calcula as letras da cena neste quadro e as acrescenta em `out`, com a
   * opacidade multiplicada por `alpha`. `isMagnetOn`: o mouse mexe nas letras.
   */
  return function renderLayer(layer: Layer, g: Grid, now: number, out: GlyphList, alpha: number, isMagnetOn: boolean) {
    const { scene } = layer;
    const pose = currentPose(layer, g, now);
    const revealMs = now - g.start;
    const d = sampleLayer(layer, g, pose);
    const mask = scene.keepBigBlobs ? bigBlobs(scene, g, d) : null;
    const grab2 = (MOUSE_RADIUS * EIGHT.grab) ** 2;
    const hold2 = (MOUSE_RADIUS * EIGHT.hold) ** 2;
    g.slotOwner.fill(-1);
    // letras perto do mouse ainda sem vaga: ganham uma depois do laço
    const candidates: EightCandidate[] = [];
    for (let index = 0; index < g.particles.length; index++) {
      const p = g.particles[index];
      // letra que some neste quadro (sem tinta, fora da mancha) solta a vaga
      const heldSlot = p.slot;
      p.slot = -1;
      const e = isReducedMotion || layer.isRevealed ? 1 : ease((revealMs - p.order * REVEAL_MS) / EACH_MS);
      if (e <= 0) continue;
      const cellIndex = p.gy * g.cols + p.gx;
      if (mask && !mask[cellIndex]) continue;
      const i = cellIndex * 4;
      const r = d[i];
      const gr = d[i + 1];
      const b = d[i + 2];
      const ink = scene.inkOf(r, gr, b);
      if (ink < INK_MIN) continue;
      scene.color(r, gr, b, edgeDetail(scene, g, d, p.gx, p.gy), rgb);
      const luminance = (0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]) / 255;
      p.ink = ink;
      p.lum = scene.isDarkBackground ? 1 - luminance : luminance;
      // o caractere foi escolhido com outro tom (algo que surgiu ou virou): escolhe de novo
      if (p.chInk === undefined || p.chLum === undefined || Math.abs(p.ink - p.chInk) > REPICK_INK || Math.abs(p.lum - p.chLum) > REPICK_LUM) {
        p.ch = pickChar(p.lum, p.ink);
        p.chInk = p.ink;
        p.chLum = p.lum;
      } else if (!isReducedMotion && Math.random() < FLICKER_CHANCE) p.ch = pickChar(p.lum, p.ink);
      // ímã: segura a vaga enquanto a casa da letra estiver perto do mouse
      const hdx = p.tx - mouse.x;
      const hdy = p.ty - mouse.y;
      const home2 = hdx * hdx + hdy * hdy;
      if (heldSlot >= 0 && isMagnetOn && home2 <= hold2 && g.slotOwner[heldSlot] < 0) p.slot = heldSlot;
      if (p.slot >= 0) {
        // presa no 8: anda até a vaga e acompanha o mouse
        g.slotOwner[p.slot] = index;
        const slot = g.slots[p.slot];
        p.ox += (mouse.x + slot.x - p.tx - p.ox) * EIGHT.pull;
        p.oy += (mouse.y + slot.y - p.ty - p.oy) * EIGHT.pull;
        p.vx = p.vy = 0;
      } else {
        if (isMagnetOn && home2 < grab2) candidates.push({ index, dist2: home2 });
        // empurrão do mouse (abre o círculo em volta do 8), com mola de volta
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dd = dx * dx + dy * dy;
        if (dd < MOUSE_RADIUS * MOUSE_RADIUS && isMagnetOn) {
          const dist = Math.sqrt(dd);
          const f = (1 - dist / MOUSE_RADIUS) * PUSH_FORCE;
          p.vx += (dx / (dist + 1)) * f;
          p.vy += (dy / (dist + 1)) * f;
        }
        p.vx *= PUSH_DAMPING;
        p.vy *= PUSH_DAMPING;
        p.ox = p.ox * SPRING_KEEP + p.vx;
        p.oy = p.oy * SPRING_KEEP + p.vy;
      }
      p.x = p.tx + p.ox;
      p.y = p.ty + p.oy;
      pushGlyph(out, p.x, p.y, p.ch, rgb[0], rgb[1], rgb[2], e * alpha, g.cell, cellIndex);
    }
    if (candidates.length) fillEightSlots(g, mouse, candidates);
  };
}
