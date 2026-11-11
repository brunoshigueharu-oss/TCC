"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/** Chave do tema no localStorage. Precisa bater com `themeInitScript`. */
export const THEME_STORAGE_KEY = "base8-tema";

const DARK_CLASS = "dark";
const THEME_EVENT = "base8-tema-mudou";

/**
 * Roda antes da primeira pintura (no `<head>`): aplica o tema salvo ou, sem
 * escolha salva, o do sistema — evita o clarão branco ao abrir no escuro.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="escuro":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("${DARK_CLASS}",d)}catch(e){}})()`;

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function readIsDark() {
  return document.documentElement.classList.contains(DARK_CLASS);
}

/** Estado do tema, lido da classe em `<html>`. No servidor assume claro. */
export function useIsDarkTheme() {
  return useSyncExternalStore(subscribe, readIsDark, () => false);
}

export function setDarkTheme(isDark: boolean) {
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "escuro" : "claro");
  } catch {
    // Sem storage (aba privada): o tema vale só para esta visita.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

type ThemeToggleProps = {
  /** `icon` = só o botão redondo; `row` = linha com rótulo (barra lateral). */
  variant?: "icon" | "row";
  className?: string;
};

/** Alterna entre tema claro e escuro. */
export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const isDark = useIsDarkTheme();
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Tema claro" : "Tema escuro";

  return (
    <button
      type="button"
      onClick={() => setDarkTheme(!isDark)}
      aria-label={variant === "icon" ? `Mudar para ${label.toLowerCase()}` : undefined}
      className={cn(
        "flex items-center text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto",
        variant === "icon"
          ? "size-11 justify-center rounded-full hover:bg-superficie"
          : "min-h-11 w-full gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-superficie",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      {variant === "row" ? label : null}
    </button>
  );
}
