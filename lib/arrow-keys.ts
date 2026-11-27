import type { KeyboardEvent } from "react";

const ARROW_DIRECTIONS: Partial<Record<string, 1 | -1>> = { ArrowRight: 1, ArrowLeft: -1 };

/**
 * Teclado dos carrosséis: ← e → no próprio carrossel trocam de item. As setas
 * apertadas dentro de um item (o divisor da vetorização, por exemplo) são dele.
 */
export function createArrowKeyHandler(step: (direction: 1 | -1) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    const direction = ARROW_DIRECTIONS[event.key];
    if (!direction) return;
    event.preventDefault();
    step(direction);
  };
}
