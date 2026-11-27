"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { DARK_CLASS, LIGHT_ONLY_PATHS, THEME_EVENT, THEME_STORAGE_KEY } from "./theme-init";

function readPreferredDark() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) return stored === "escuro";
  } catch {
    // Sem storage: cai na preferência do sistema.
  }
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Reaplica o tema a cada navegação no cliente: a landing fica sempre clara e,
 * ao entrar no hub, volta a escolha salva — sem gravar nada no storage.
 */
export function ThemeRouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    const isDark = !LIGHT_ONLY_PATHS.includes(pathname) && readPreferredDark();
    if (document.documentElement.classList.contains(DARK_CLASS) === isDark) return;
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [pathname]);

  return null;
}
