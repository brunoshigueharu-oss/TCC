"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

/** Buscas recentes da pessoa, guardadas só neste navegador. */
const STORAGE_KEY = "base8-buscas-recentes";
const CHANGE_EVENT = "base8-buscas-recentes-mudou";
const MAX_RECENT = 6;
const EMPTY: string[] = [];

let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = z.array(z.string()).safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
    cache = parsed.success ? parsed.data : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem storage (aba privada): a lista vale só para esta visita.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function useRecentSearches() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Põe o termo no topo (sem repetir, ignorando maiúsculas). */
export function rememberSearch(term: string) {
  const clean = term.trim();
  if (!clean) return;
  const rest = read().filter((item) => item.toLowerCase() !== clean.toLowerCase());
  write([clean, ...rest].slice(0, MAX_RECENT));
}

export function forgetSearch(term: string) {
  write(read().filter((item) => item !== term));
}

export function clearSearches() {
  write([]);
}
