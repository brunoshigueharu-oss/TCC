"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TooltipProps = {
  /** Texto curto da dica. */
  label: ReactNode;
  /** Atalho mostrado ao lado do texto, já como `<Kbd>`. */
  shortcut?: ReactNode;
  /** Elemento que recebe a dica (precisa aceitar `ref` e props de evento). */
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Desliga a dica sem desmontar o gatilho (ex.: barra lateral aberta). */
  disabled?: boolean;
  /** Espera antes de abrir, em ms. */
  delay?: number;
  className?: string;
};

/**
 * Dica curta que aparece no hover e no foco pelo teclado. A dica é um reforço:
 * o gatilho continua precisando de nome acessível próprio (`aria-label` ou
 * texto). Pílula escura que inverte com o tema.
 */
export function Tooltip({
  label,
  shortcut,
  children,
  side = "top",
  align = "center",
  disabled = false,
  delay = 350,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root disabled={disabled}>
      <TooltipPrimitive.Trigger render={children} delay={delay} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} align={align} sideOffset={8} className="z-[80]">
          <TooltipPrimitive.Popup
            className={cn(
              "flex origin-(--transform-origin) items-center gap-2 rounded-lg bg-texto px-2.5 py-1.5 text-xs font-medium text-fundo transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:duration-0 data-starting-style:scale-95 data-starting-style:opacity-0",
              className,
            )}
          >
            {label}
            {shortcut ? <span className="flex items-center gap-1 opacity-70 [&_kbd]:border-fundo/25 [&_kbd]:bg-transparent [&_kbd]:text-fundo">{shortcut}</span> : null}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/** Agrupa dicas vizinhas: depois da primeira, as outras abrem sem espera. */
export const TooltipProvider = TooltipPrimitive.Provider;
