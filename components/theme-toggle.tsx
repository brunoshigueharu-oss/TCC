"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

import { DARK_CLASS, THEME_EVENT, THEME_STORAGE_KEY } from "./theme-init";

// Reexportados por compatibilidade. No Server Component, importe de
// `./theme-init` — valores vindos de um módulo "use client" viram referência
// de cliente e o script não chega ao HTML.
export { THEME_STORAGE_KEY, themeInitScript } from "./theme-init";

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
        "flex items-center text-texto-secundario outline-none transition-[color,background-color,transform] duration-200 hover:text-texto active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-texto",
        variant === "icon"
          ? "size-11 justify-center rounded-full hover:bg-superficie"
          : "min-h-11 w-full gap-3 rounded-xl px-3 text-[15px] font-medium hover:bg-superficie",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.75} />
      {variant === "row" ? <span className="nav-recolhida:sr-only">{label}</span> : null}
    </button>
  );
}
