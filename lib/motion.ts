/**
 * Movimento compartilhado pela landing: a curva padrão do site, as curvas de
 * easing das animações feitas à mão e os utilitários dos laços de animação.
 */

/** Curva padrão do site (docs/direcao-visual.md), no formato do `motion`. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Saída suave: rápida no começo, freando no fim. */
export function easeOutQuart(amount: number) {
  return 1 - (1 - amount) ** 4;
}

/** Acelera e freia (cúbica), para giros e trocas que começam e terminam parados. */
export function easeInOutCubic(amount: number) {
  return amount < 0.5 ? 4 * amount ** 3 : 1 - (-2 * amount + 2) ** 3 / 2;
}

/** Acelera e freia (quadrática), mais suave que a cúbica. */
export function easeInOutQuad(amount: number) {
  return amount < 0.5 ? 2 * amount * amount : 1 - (-2 * amount + 2) ** 2 / 2;
}

/**
 * Passo máximo de um laço de animação, em segundos: com a aba escondida ou a
 * página travada, o intervalo entre quadros cresce e a mola "explodiria".
 */
export const MAX_STEP_SECONDS = 0.05;

/**
 * Várias mudanças de visibilidade podem chegar juntas (rolagem rápida, janela
 * redimensionada): vale a mais recente. Ler a primeira já deixou peças
 * congeladas na tela.
 */
export function isLatestIntersecting(entries: IntersectionObserverEntry[]) {
  return entries[entries.length - 1].isIntersecting;
}

/**
 * Laço de animação que roda enquanto houver movimento: `step` recebe o tempo
 * desde o quadro anterior (já limitado por `MAX_STEP_SECONDS`) e devolve se
 * ainda há algo se mexendo. `start` é idempotente; `stop` cancela.
 */
export function createSettlingLoop(step: (deltaSeconds: number) => boolean) {
  let frame = 0;
  let lastTime = 0;

  const tick = (now: number) => {
    const deltaSeconds = Math.min(MAX_STEP_SECONDS, (now - lastTime) / 1000);
    lastTime = now;
    frame = step(deltaSeconds) ? requestAnimationFrame(tick) : 0;
  };

  return {
    start() {
      if (frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
