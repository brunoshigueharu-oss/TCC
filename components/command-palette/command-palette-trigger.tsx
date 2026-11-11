"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { openCommandPalette } from "./open-command-palette";
import { ShortcutKeys } from "./shortcut-keys";

const PALETTE_SHORTCUT = { keys: ["mod", "K"] };

type CommandPaletteTriggerProps = {
  /**
   * `field` = campo falso "Buscar ⌘K" (barra lateral, cabeçalhos);
   * `icon` = só a lupa, redonda (barras estreitas e celular).
   */
  variant?: "field" | "icon";
  /** Texto do campo falso. */
  label?: string;
  className?: string;
};

/**
 * Botão que abre a paleta de comandos. Pode ser usado em qualquer tela do
 * hub: a paleta já está montada na casca.
 */
export function CommandPaletteTrigger({
  variant = "field",
  label = "Buscar",
  className,
}: CommandPaletteTriggerProps) {
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Buscar e executar comandos"
        aria-haspopup="dialog"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full text-texto-secundario outline-none transition-[color,background-color,transform] duration-200 hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-95",
          className,
        )}
      >
        <Search aria-hidden className="size-5" strokeWidth={1.75} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-haspopup="dialog"
      className={cn(
        "group flex h-11 w-full items-center gap-3 rounded-xl border border-linha bg-fundo px-3 text-left text-[15px] text-texto-secundario outline-none transition-[color,border-color,background-color,transform] duration-200 hover:border-desativado hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.99]",
        className,
      )}
    >
      <Search aria-hidden className="size-[18px] shrink-0" strokeWidth={1.75} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ShortcutKeys shortcut={PALETTE_SHORTCUT} className="hidden lg:inline-flex" />
    </button>
  );
}
