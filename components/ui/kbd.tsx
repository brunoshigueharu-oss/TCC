import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Tecla de atalho, em mono (ex.: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`). Use `KbdGroup`
 * para juntar as teclas de um mesmo atalho.
 */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-linha bg-fundo px-1 font-mono text-[11px] leading-none font-medium text-texto-secundario tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

/** Conjunto de teclas de um atalho, com espaçamento curto entre elas. */
export function KbdGroup({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="kbd-group" className={cn("inline-flex items-center gap-1", className)} {...props} />;
}
