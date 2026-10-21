"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "tcc:viewport-preset";
const listeners = new Set<() => void>();

function readPresetId(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writePresetId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(STORAGE_KEY, id);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sem storage (aba anônima etc.): a escolha só não persiste.
  }
  listeners.forEach((listener) => listener());
}

/** Tamanho de tela escolhido no seletor; lembrado entre recarregamentos. */
export function useViewportPreset() {
  const presetId = useSyncExternalStore(subscribe, readPresetId, () => null);
  return [presetId, writePresetId] as const;
}

const noopSubscribe = () => () => {};

/**
 * `true` quando a página está dentro do iframe da pré-visualização.
 * No servidor é `false`, então o botão sai no HTML; dentro da prévia ele some
 * logo após a hidratação.
 */
export function useIsEmbedded() {
  return useSyncExternalStore(
    noopSubscribe,
    () => window.self !== window.top,
    () => false,
  );
}
