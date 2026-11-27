/**
 * Motor comum dos efeitos de caracteres (porte do protótipo `prototipos/pontilhismo`).
 *
 * O vídeo é guardado quadro a quadro na memória; a cada quadro de tela ele é
 * desenhado numa grade pequena e cada célula com cor vira um caractere.
 * Cada efeito (`ascii-bloom`, `ascii-betta`) só descreve a sua cena: recorte,
 * tinta, cor e o relógio que diz qual instante do vídeo mostrar.
 *
 * Este arquivo só compõe as peças de `lib/ascii/` e mantém a API pública:
 * `stage-render` desenha, `stage-dom` liga o canvas ao navegador.
 */

import { FALLBACK_FONT, GLYPH, MOUSE_FAR } from "./ascii/constants";
import { createStageRenderer } from "./ascii/stage-render";
import { attachStageDom } from "./ascii/stage-dom";
import type { AsciiScene, Pose, Rgb } from "./ascii/types";
import { prefersReducedMotion } from "./reduced-motion";

export { vividHsl, type VividOptions } from "./ascii/color";
export { FRAME_SECONDS } from "./ascii/constants";
export type { AsciiScene, Pose, Rgb };

/** Palco: um canvas que mostra uma cena por vez e troca de cena com morph. */
export type AsciiStage = {
  /** Mostra a cena; se já houver outra na tela, as letras se transformam nela. */
  show: (scene: AsciiScene, src: string) => void;
  /** Desliga tudo (quadros guardados, observadores e o laço de desenho). */
  stop: () => void;
};

/**
 * Liga o palco no canvas. Cada cena só baixa o vídeo quando o canvas aparece
 * na tela; a próxima cena é preparada enquanto a atual continua animando.
 */
export type AsciiStageOptions = {
  /**
   * Margem (px) do canvas em volta da área da cena. As letras empurradas pelo
   * mouse podem passar da borda da cena sem serem cortadas. O canvas precisa
   * ser maior que a área por essa margem em cada lado (e sem eventos de
   * ponteiro, para não cobrir o que está embaixo): o mouse é lido na janela.
   */
  bleed?: number;
};

function readFontFamily(canvas: HTMLCanvasElement) {
  // Geist Mono (variável, carregada no layout raiz) tem peso 900: caracteres mais cheios
  const geistMono = getComputedStyle(canvas).getPropertyValue("--font-geist-mono").trim();
  return geistMono ? `${geistMono}, ui-monospace, monospace` : FALLBACK_FONT;
}

export function createAsciiStage(canvas: HTMLCanvasElement, { bleed = 0 }: AsciiStageOptions = {}): AsciiStage {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { show: () => {}, stop: () => {} };

  const isReducedMotion = prefersReducedMotion();
  const fontFamily = readFontFamily(canvas);
  const mouse = { x: MOUSE_FAR, y: MOUSE_FAR };
  let isStopped = false;
  let isVisible = false;
  let raf = 0;

  const renderer = createStageRenderer({ ctx, fontFamily, isReducedMotion, mouse, margin: bleed, onChange: schedule });

  function draw(now: number) {
    raf = 0;
    if (isStopped) return;
    if (renderer.draw(now)) schedule();
  }

  function schedule() {
    if (!raf && isVisible && !isStopped) raf = requestAnimationFrame(draw);
  }

  // a fonte da página só baixa quando usada no DOM: pede o peso 900 para o canvas
  document.fonts.load(`${GLYPH.weight} 16px ${fontFamily}`).then(schedule, () => {});

  const detachDom = attachStageDom(canvas, bleed, mouse, {
    onResize: (width, height, dpr) => {
      renderer.setSize(width, height, dpr);
      schedule();
    },
    onVisibilityChange: (nextIsVisible) => {
      isVisible = nextIsVisible;
      if (isVisible) renderer.startCaptures();
      schedule();
    },
  });

  return {
    show(scene, src) {
      if (isStopped) return;
      renderer.show(scene, src, isVisible);
      schedule();
    },
    stop() {
      isStopped = true;
      cancelAnimationFrame(raf);
      detachDom();
      renderer.release();
    },
  };
}

/**
 * Liga uma cena só no canvas. Devolve a função que desliga tudo (quadros
 * guardados, observadores e o laço de desenho).
 */
export function startAsciiScene(
  canvas: HTMLCanvasElement,
  scene: AsciiScene,
  src: string,
  options?: AsciiStageOptions,
) {
  const stage = createAsciiStage(canvas, options);
  stage.show(scene, src);
  return stage.stop;
}
