"use client";

import { useCallback, useSyncExternalStore } from "react";
import { z } from "zod";

/**
 * Reações da pessoa na Comunidade (votar, salvar, seguir tag). Protótipo: não
 * há banco, então o estado vive no navegador (`localStorage`) e vale entre o
 * feed, a página da tag e o post. A tela responde na hora (otimista); na
 * versão real, cada alternância dispara uma Server Action em segundo plano.
 */

const STORAGE_KEY = "base8-comunidade-reacoes";
const CHANGE_EVENT = "base8-comunidade-reacoes-mudou";

const reactionsSchema = z.object({
  votes: z.array(z.string()),
  saves: z.array(z.string()),
  follows: z.array(z.string()),
});

type Reactions = z.infer<typeof reactionsSchema>;
export type ReactionKind = keyof Reactions;

const EMPTY: Reactions = { votes: [], saves: [], follows: [] };

let cache: Reactions | null = null;

function read(): Reactions {
  if (cache) return cache;
  try {
    const parsed = reactionsSchema.safeParse(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"),
    );
    cache = parsed.success ? parsed.data : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Reactions) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem storage (aba privada): a reação vale só para esta visita.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** `[ativo, alternar]` para uma reação (ex.: `useReaction("votes", "post:grid-layout")`). */
export function useReaction(
  kind: ReactionKind,
  id: string,
): [boolean, () => void] {
  const isOn = useSyncExternalStore(
    subscribe,
    () => read()[kind].includes(id),
    () => false,
  );

  const toggle = useCallback(() => {
    const current = read();
    const list = current[kind];
    write({
      ...current,
      [kind]: list.includes(id)
        ? list.filter((item) => item !== id)
        : [...list, id],
    });
  }, [kind, id]);

  return [isOn, toggle];
}

/** Ids salvos, para a lista "Salvos" da coluna lateral. */
export function useSavedIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    () => read().saves,
    () => EMPTY.saves,
  );
}
