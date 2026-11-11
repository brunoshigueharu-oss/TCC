"use client";

import { useSyncExternalStore } from "react";

import { COLLAPSED, NAV_ATTRIBUTE, NAV_STORAGE_KEY } from "./side-nav-init";

const NAV_EVENT = "base8-nav-mudou";

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
