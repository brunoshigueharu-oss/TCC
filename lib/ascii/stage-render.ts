import { captureFrames } from "./capture";
import { GLYPH, MORPH } from "./constants";
import { buildGrid } from "./grid";
import { createGlyphList, indexByCell, followLive, pushGlyph, snapshotGlyphs, type GlyphList } from "./glyph-list";
import { createLayerRenderer } from "./layer-render";
import { pairGlyphs, renderMorph } from "./morph";
import type { AsciiScene, Layer, Morph, Mouse } from "./types";

/** Área mínima (px) para montar a grade: antes disso o canvas ainda não tem tamanho de verdade. */
const MIN_STAGE_PX = 10;

export type StageRendererOptions = {
  ctx: CanvasRenderingContext2D;
  fontFamily: string;
  isReducedMotion: boolean;
  mouse: Mouse;
  /** Margem (px) do canvas em volta da área da cena. */
  margin: number;
  /** Chamado quando algo novo pode ser desenhado (fim da captura). */
  onChange: () => void;
};

/**
 * Parte de desenho do palco: guarda as cenas (atual, pendente e a que sai numa
 * troca), calcula as letras de cada quadro e pinta no canvas. Não conhece o DOM.
 */
export function createStageRenderer({ ctx, fontFamily, isReducedMotion, mouse, margin, onChange }: StageRendererOptions) {
  const renderLayer = createLayerRenderer(isReducedMotion, mouse);
  /** O que foi pintado no último quadro (ponto de partida de uma troca de cena). */
  const drawn = createGlyphList();
  /** Rascunho da cena nova no instante em que a troca começa. */
  const target = createGlyphList();
  /** Cenas ao vivo durante a troca (a que sai e a que entra) e o índice casa → letra de cada uma. */
  const outgoingLive = createGlyphList();
  const incomingLive = createGlyphList();
  let outgoingIndex = new Int32Array(0);
  let incomingIndex = new Int32Array(0);
  let current: Layer | null = null;
  let pending: Layer | null = null;
  let morph: Morph | null = null;
  let width = 0;
  let height = 0;
  let dpr = 0;

  function createLayer(scene: AsciiScene, src: string): Layer {
    return {
      scene,
      src,
      clock: scene.createClock(),
      frames: [],
      abort: new AbortController(),
      isCaptured: false,
      hasFailed: false,
      hasStartedCapture: false,
      grid: null,
      isRevealed: false,
    };
  }

  function releaseLayer(layer: Layer) {
    layer.abort.abort();
    layer.frames.forEach((f) => f.bmp.close());
    layer.frames.length = 0;
  }

  function startCapture(layer: Layer) {
    if (layer.hasStartedCapture) return;
    layer.hasStartedCapture = true;
    captureFrames(layer.src, layer.scene, layer.frames, layer.abort.signal)
      .then(() => {
        layer.isCaptured = true;
        onChange();
      })
      .catch(() => (layer.hasFailed = true));
  }

  /** Encerra a troca em andamento e solta a cena que estava saindo. */
  function endMorph() {
    if (morph?.outgoing) releaseLayer(morph.outgoing);
    morph = null;
  }

  /** A cena seguinte tem o primeiro quadro: começa a troca a partir do que está na tela. */
  function beginMorph(next: Layer, now: number) {
    const from = snapshotGlyphs(drawn);
    // troca interrompida por outra: a cena que ainda saía já não aparece
    endMorph();
    const outgoing = current;
    current = next;
    pending = null;
    // sem nada na tela (ou menos movimento): só entra, com a pincelada de sempre
    const grid = from.length && !isReducedMotion ? buildGrid(next, now, width, height) : null;
    if (!grid) {
      if (outgoing) releaseLayer(outgoing);
      return;
    }
    // a cena nova já começa a animar agora, por baixo das letras em voo
    next.grid = grid;
    next.isRevealed = true;
    target.count = 0;
    renderLayer(next, grid, now, target, 1, false);
    const targets = snapshotGlyphs(target);
    morph = { start: now, particles: pairGlyphs(from, targets, grid.cell), sources: from, targets, outgoing };
  }

  /** As duas cenas andam um quadro; as letras em voo seguem a casa delas em cada uma. */
  function followScenes(m: Morph, layer: Layer | null, now: number) {
    outgoingLive.count = 0;
    incomingLive.count = 0;
    const out = m.outgoing;
    if (out?.grid) {
      renderLayer(out, out.grid, now, outgoingLive, 1, false);
      outgoingIndex = indexByCell(outgoingLive, out.grid.cols * out.grid.rows, outgoingIndex);
    }
    if (layer?.grid) {
      renderLayer(layer, layer.grid, now, incomingLive, 1, false);
      incomingIndex = indexByCell(incomingLive, layer.grid.cols * layer.grid.rows, incomingIndex);
    }
    if (out?.grid) for (const glyph of m.sources) followLive(glyph, outgoingLive, outgoingIndex, out.grid.cols, out.grid.rows);
    if (layer?.grid) for (const glyph of m.targets) followLive(glyph, incomingLive, incomingIndex, layer.grid.cols, layer.grid.rows);
  }

  function paint(list: GlyphList) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fontPx = -1;
    for (let i = 0; i < list.count; i++) {
      const glyph = list.items[i];
      if (glyph.a <= 0.01) continue;
      // tamanho em meios pixels: troca a fonte só quando muda de verdade
      const px = Math.round(glyph.size * GLYPH.scale * 2) / 2;
      if (px !== fontPx) {
        fontPx = px;
        ctx.font = `${GLYPH.weight} ${px}px ${fontFamily}`;
      }
      ctx.globalAlpha = Math.min(1, glyph.a);
      ctx.fillStyle = `rgb(${glyph.r},${glyph.g},${glyph.b})`;
      ctx.fillText(glyph.ch, glyph.x, glyph.y);
    }
    ctx.globalAlpha = 1;
  }

  /** Calcula o que a troca de cena mostra neste quadro (ou encerra a troca). */
  function composeMorph(m: Morph, layer: Layer | null, now: number) {
    const k = (now - m.start) / MORPH.ms;
    if (k >= 1) {
      endMorph();
      return;
    }
    followScenes(m, layer, now);
    // fim da troca: a cena nova, já animada, assume no lugar das letras em voo
    const handoff = Math.min(1, Math.max(0, (k - (1 - MORPH.handoff)) / MORPH.handoff));
    renderMorph(m, k, drawn, 1 - handoff);
    if (handoff <= 0) return;
    for (let i = 0; i < incomingLive.count; i++) {
      const glyph = incomingLive.items[i];
      pushGlyph(drawn, glyph.x, glyph.y, glyph.ch, glyph.r, glyph.g, glyph.b, glyph.a * handoff, glyph.size, glyph.cell);
    }
  }

  return {
    /** Mostra a cena; se já houver outra, `pending` espera o primeiro quadro para a troca. */
    show(scene: AsciiScene, src: string, isVisible: boolean) {
      const shown = pending ?? current;
      if (shown && shown.scene === scene && shown.src === src) return;
      if (pending) releaseLayer(pending);
      const layer = createLayer(scene, src);
      if (current) pending = layer;
      else current = layer;
      if (isVisible) startCapture(layer);
    },

    /** O canvas apareceu na tela: baixa os vídeos que faltam. */
    startCaptures() {
      if (current) startCapture(current);
      if (pending) startCapture(pending);
    },

    /** Novo tamanho da área da cena: refaz a grade (e a entrada) no próximo quadro. */
    setSize(nextWidth: number, nextHeight: number, nextDpr: number) {
      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      // uma troca no meio do caminho é cortada
      endMorph();
      if (current) {
        current.grid = null;
        current.isRevealed = false;
      }
    },

    /** Desenha um quadro; devolve se ainda há o que animar (se não, o laço pode parar). */
    draw(now: number) {
      if (pending?.hasFailed) {
        releaseLayer(pending);
        pending = null;
      }
      if (pending && pending.frames.length && width > MIN_STAGE_PX) beginMorph(pending, now);
      const layer = current;
      if (layer && !layer.grid && layer.frames.length && width > MIN_STAGE_PX) layer.grid = buildGrid(layer, now, width, height);
      // limpa o canvas inteiro (inclui a margem) e passa a desenhar em coordenadas da área da cena
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, margin * dpr, margin * dpr);
      drawn.count = 0;
      if (morph) composeMorph(morph, layer, now);
      if (!morph && layer?.grid) renderLayer(layer, layer.grid, now, drawn, 1, !isReducedMotion);
      paint(drawn);
      // menos movimento: a imagem é fixa, então para depois de desenhar o vídeo inteiro uma vez
      const isSettled = isReducedMotion && !pending && !!layer?.isCaptured && !!layer.grid;
      const hasFailed = !!layer?.hasFailed && !pending;
      return !isSettled && !hasFailed;
    },

    /** Solta os quadros guardados e as cenas. */
    release() {
      endMorph();
      if (current) releaseLayer(current);
      if (pending) releaseLayer(pending);
    },
  };
}
