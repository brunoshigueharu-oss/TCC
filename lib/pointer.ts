import { clamp } from "@/lib/math";

/**
 * Posição do ponteiro dentro do elemento, de -1 a 1 em cada eixo (0 = centro;
 * y cresce para baixo, como na tela).
 */
export function pointerToUnit(event: { clientX: number; clientY: number }, element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
    y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
  };
}
