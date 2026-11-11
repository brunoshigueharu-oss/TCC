/**
 * Constantes e script de tema, num módulo sem "use client" para o layout
 * raiz (Server Component) receber o texto do script.
 */

/** Chave do tema no localStorage. Precisa bater com `themeInitScript`. */
export const THEME_STORAGE_KEY = "base8-tema";

export const DARK_CLASS = "dark";
export const THEME_EVENT = "base8-tema-mudou";

/**
 * Roda antes da primeira pintura (no `<head>`): aplica o tema salvo ou, sem
 * escolha salva, o do sistema — evita o clarão branco ao abrir no escuro.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t?t==="escuro":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("${DARK_CLASS}",d)}catch(e){}})()`;

