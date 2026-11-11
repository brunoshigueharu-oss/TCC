import { useSyncExternalStore } from "react";

/** Chave no localStorage. Precisa bater com `navInitScript`. */
const NAV_STORAGE_KEY = "base8-nav";
const NAV_ATTRIBUTE = "data-nav";
const COLLAPSED = "recolhida";
const NAV_EVENT = "base8-nav-mudou";

/**
 * Roda antes da primeira pintura (no `<head>`): aplica a barra lateral
 * recolhida salva, para a coluna não "pular" de largura ao carregar. A
 * largura em si é CSS (variante `nav-recolhida` em `app/globals.css`).
 */
export const navInitScript = `(function(){try{if(localStorage.getItem("${NAV_STORAGE_KEY}")==="${COLLAPSED}")document.documentElement.setAttribute("${NAV_ATTRIBUTE}","${COLLAPSED}")}catch(e){}})()`;

function subscribe(onChange: () => void) {
  window.addEventListener(NAV_EVENT, onChange);
  return () => window.removeEventListener(NAV_EVENT, onChange);
}

function readIsCollapsed() {
  return document.documentElement.getAttribute(NAV_ATTRIBUTE) === COLLAPSED;
}

/** Barra lateral recolhida? Lido do atributo em `<html>`; no servidor assume aberta. */
export function useIsNavCollapsed() {
  return useSyncExternalStore(subscribe, readIsCollapsed, () => false);
}

export function setNavCollapsed(isCollapsed: boolean) {
  if (isCollapsed) document.documentElement.setAttribute(NAV_ATTRIBUTE, COLLAPSED);
  else document.documentElement.removeAttribute(NAV_ATTRIBUTE);
  try {
    localStorage.setItem(NAV_STORAGE_KEY, isCollapsed ? COLLAPSED : "aberta");
  } catch {
    // Sem storage (aba privada): vale só para esta visita.
  }
  window.dispatchEvent(new Event(NAV_EVENT));
}

export function toggleNavCollapsed() {
  setNavCollapsed(!readIsCollapsed());
}
