/** Chave no localStorage da barra lateral (aberta/recolhida). */
export const NAV_STORAGE_KEY = "base8-nav";
export const NAV_ATTRIBUTE = "data-nav";
export const COLLAPSED = "recolhida";

/**
 * Roda antes da primeira pintura (no `<head>`): aplica a barra lateral
 * recolhida salva, para a coluna não "pular" de largura ao carregar. A
 * largura em si é CSS (variante `nav-recolhida` em `app/globals.css`).
 */
export const navInitScript = `(function(){try{if(localStorage.getItem("${NAV_STORAGE_KEY}")==="${COLLAPSED}")document.documentElement.setAttribute("${NAV_ATTRIBUTE}","${COLLAPSED}")}catch(e){}})()`;

