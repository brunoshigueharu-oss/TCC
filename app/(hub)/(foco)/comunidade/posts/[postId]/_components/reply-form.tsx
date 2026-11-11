"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { replyToPost } from "../_actions/reply-to-post";
import { replySchema, type ReplyInput } from "../_actions/reply-schema";

type ReplyFormProps = {
  postId: string;
  /** Chamado com o texto quando o servidor aceita a resposta. */
  onSent: (body: string) => void;
};

/**
 * Campo de responder, fixo no rodapé. Cresce com o texto; ⌘/Ctrl + Enter
 * envia. Valida no navegador e de novo na Server Action.
 */
export function ReplyForm({ postId, onSent }: ReplyFormProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<ReplyInput>({
    resolver: zodResolver(replySchema),
    defaultValues: { postId, body: "" },
  });

  async function handleReply(values: ReplyInput) {
    setFeedback(null);
    const result = await replyToPost(values);
    if (result.errors?.body?.[0]) {
      form.setError("body", { message: result.errors.body[0] });
      return;
    }
    if (!result.success) {
      form.setError("body", { message: result.message ?? "Não foi possível enviar." });
      return;
    }
    onSent(values.body.trim());
    form.reset({ postId, body: "" });
    setFeedback("Resposta enviada. Neste protótipo ela some ao recarregar a página.");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void form.handleSubmit(handleReply)();
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(handleReply)}
      noValidate
      className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-col gap-2 border-t border-linha bg-fundo/95 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md lg:-mx-10 lg:px-10 lg:pb-4"
    >
      <Controller
        name="body"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1.5">
            <FieldLabel htmlFor="resposta" className="sr-only">
              Sua resposta
            </FieldLabel>
            <div className="flex items-end gap-2">
              <Textarea
                {...field}
                id="resposta"
                rows={1}
                placeholder="Escreva uma resposta…"
                aria-invalid={fieldState.invalid}
                aria-describedby="resposta-dica"
                onKeyDown={handleKeyDown}
                onChange={(event) => {
                  setFeedback(null);
                  field.onChange(event);
                }}
                className="max-h-48 min-h-11 flex-1 resize-none border-linha py-2.5"
              />
              <ColorBurstButton type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting ? "Enviando…" : "Enviar"}
              </ColorBurstButton>
            </div>
            <FieldError errors={[fieldState.error]} className="text-xs" />
          </Field>
        )}
      />
      <p id="resposta-dica" aria-live="polite" className="font-mono text-[11px] text-texto-secundario">
        {feedback ?? "⌘ + Enter envia"}
      </p>
    </form>
  );
}
