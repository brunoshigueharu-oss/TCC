/**
 * Leitura pontual de "menos movimento" para código imperativo (laços de
 * animação, handlers de ponteiro), que consulta a preferência na hora do
 * evento. Em componentes React, usar `useReducedMotion` de `motion/react`.
 */
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
