"use client";

import { useActionState, useEffect } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { toast } from "@/components/ui/toast";
import { publishCourse, type PublishResult } from "../_actions/publish-course";

/** Botão Publicar: a Server Action confere o checklist e devolve o resultado. */
export function PublishButton({ courseId }: { courseId: string }) {
  const [result, formAction, isPending] = useActionState<PublishResult | null, FormData>(publishCourse, null);

  // Aviso no canto além do texto embaixo do botão (que fica para leitores de tela).
  useEffect(() => {
    if (!result) return;
    toast({
      title: result.success ? "Minicurso publicado" : "Ainda falta um passo",
      description: result.message,
      tone: result.success ? "sucesso" : "erro",
    });
  }, [result]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="courseId" value={courseId} />
      <ColorBurstButton type="submit" disabled={isPending} className="w-full">
        {isPending ? "Publicando…" : "Publicar minicurso"}
      </ColorBurstButton>
      <p role={result && !result.success ? "alert" : "status"} className="text-xs leading-relaxed text-texto-secundario">
        {result?.message ?? "Cursos da comunidade são gratuitos para todos os membros."}
      </p>
    </form>
  );
}
