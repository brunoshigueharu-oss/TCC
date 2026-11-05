"use client";

import { useActionState } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { publishCourse, type PublishResult } from "../_actions/publish-course";

/** Botão Publicar: a Server Action confere o checklist e devolve o resultado. */
export function PublishButton({ courseId }: { courseId: string }) {
  const [result, formAction, isPending] = useActionState<PublishResult | null, FormData>(
    publishCourse,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="courseId" value={courseId} />
      <ColorBurstButton type="submit" disabled={isPending} className="w-full">
        {isPending ? "Publicando…" : "Publicar"}
      </ColorBurstButton>
      {result ? (
        <p
          role={result.success ? "status" : "alert"}
          className={result.success ? "rounded-xl bg-acao/15 p-3 text-sm" : "text-sm text-texto-secundario"}
        >
          {result.message}
        </p>
      ) : (
        <p className="text-xs text-texto-secundario">Cursos da comunidade são gratuitos para todos os membros.</p>
      )}
    </form>
  );
}
