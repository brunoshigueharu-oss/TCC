import { MOUSE_FAR } from "./constants";
import { isLatestIntersecting } from "../motion";
import type { Mouse } from "./types";

export type StageDomHandlers = {
  /** Tamanho da área da cena (sem a margem) e densidade de pixels, depois de assentar. */
  onResize: (width: number, height: number, dpr: number) => void;
  /** O canvas entrou ou saiu da tela. */
  onVisibilityChange: (isVisible: boolean) => void;
};

/** Espera o redimensionamento assentar antes de refazer a grade (e a entrada). */
const RESIZE_DEBOUNCE_MS = 150;
/** Densidade de pixels máxima do canvas. */
const MAX_DPR = 2;

/**
 * Liga o canvas ao DOM: tamanho (com margem `bleed` em cada lado), visibilidade
 * e ponteiro. O ponteiro é lido no próprio canvas; com margem o canvas não
 * recebe eventos (para não cobrir o que está embaixo), então é lido na janela.
 * Devolve a função que desliga tudo.
 */
export function attachStageDom(
  canvas: HTMLCanvasElement,
  bleed: number,
  mouse: Mouse,
  { onResize, onVisibilityChange }: StageDomHandlers,
) {
  let width = 0;
  let height = 0;
  let dpr = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const nextDpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    // única conta de margem: a área da cena é o canvas menos `bleed` de cada lado
    const nextWidth = rect.width - 2 * bleed;
    const nextHeight = rect.height - 2 * bleed;
    // o observador sempre avisa uma vez ao começar: sem mudança, não refaz a entrada
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    onResize(width, height, dpr);
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE_MS);
  });
  resizeObserver.observe(canvas);
  // fora da tela (ou oculto por `hidden`): não baixa o vídeo e para o laço de desenho
  const visibilityObserver = new IntersectionObserver((entries) => onVisibilityChange(isLatestIntersecting(entries)));
  visibilityObserver.observe(canvas);

  const pointerTarget: EventTarget = bleed > 0 ? window : canvas;
  // na janela, "saiu" é o ponteiro deixar a janela (sem alvo de destino); no canvas, `pointerleave`
  const leaveEvent = bleed > 0 ? "pointerout" : "pointerleave";
  // Último ponto do cursor na janela: a rolagem move o canvas sem mover o cursor, então a posição local é refeita.
  let pointer: { x: number; y: number } | null = null;
  const placeMouse = () => {
    if (!pointer) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = pointer.x - rect.left - bleed;
    mouse.y = pointer.y - rect.top - bleed;
  };
  const handlePointerMove = (event: Event) => {
    if (!(event instanceof PointerEvent)) return;
    pointer = { x: event.clientX, y: event.clientY };
    placeMouse();
  };
  const handlePointerLeave = (event: Event) => {
    if (event.type === "pointerout" && event instanceof PointerEvent && event.relatedTarget) return;
    pointer = null;
    mouse.x = mouse.y = MOUSE_FAR;
  };
  pointerTarget.addEventListener("pointermove", handlePointerMove);
  pointerTarget.addEventListener(leaveEvent, handlePointerLeave);
  window.addEventListener("scroll", placeMouse, { passive: true });

  resize();

  return () => {
    clearTimeout(resizeTimer);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    pointerTarget.removeEventListener("pointermove", handlePointerMove);
    pointerTarget.removeEventListener(leaveEvent, handlePointerLeave);
    window.removeEventListener("scroll", placeMouse);
  };
}
