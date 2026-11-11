"use client";

import { useEffect, useRef } from "react";
import { z } from "zod";

import { Textarea } from "@/components/ui/textarea";

const NOTE_MAX_LENGTH = 2000;
/** O que está guardado no aparelho pode ter sido alterado: valida antes de usar. */
const storedNoteSchema = z.string().max(NOTE_MAX_LENGTH);

function storageKey(lessonId: string) {
  return `base8-anotacoes-${lessonId}`;
}

type LessonNotesProps = {
  lessonId: string;
};

/**
 * Anotações da lição. Ficam só neste aparelho (localStorage) e são salvas a
 * cada tecla; na versão real iriam para a conta da pessoa.
 */
export function LessonNotes({ lessonId }: LessonNotesProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    try {
      const stored = storedNoteSchema.safeParse(localStorage.getItem(storageKey(lessonId)));
      if (stored.success) field.value = stored.data;
    } catch {
      // Sem storage (aba privada): o campo começa vazio.
    }
  }, [lessonId]);

  function handleChange(value: string) {
    try {
      localStorage.setItem(storageKey(lessonId), value);
    } catch {
      // Sem storage: a anotação vale só enquanto a página estiver aberta.
    }
  }

  return (
    <section aria-labelledby="anotacoes" className="flex flex-col">
      <h2
        id="anotacoes"
        className="flex min-h-11 items-center gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
        Anotações
      </h2>
      <Textarea
        ref={fieldRef}
        aria-labelledby="anotacoes"
        aria-describedby="anotacoes-ajuda"
        maxLength={NOTE_MAX_LENGTH}
        placeholder="Escreva o que quer lembrar desta lição."
        onChange={(event) => handleChange(event.target.value)}
        className="mt-3 min-h-28 rounded-xl border-linha bg-fundo text-sm leading-relaxed focus-visible:border-texto focus-visible:ring-0 dark:bg-fundo"
      />
      <p id="anotacoes-ajuda" className="pt-2 text-xs text-texto-secundario">
        Salvas automaticamente neste aparelho.
      </p>
    </section>
  );
}
