"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { replyToPost } from "../_actions/reply-to-post";
import { replySchema, type ReplyInput } from "../_actions/reply-schema";

type ReplyFormProps = {
  postId: string;
};

/** Campo de responder, fixo no rodapé do post. Envia por Server Action. */
export function ReplyForm({ postId }: ReplyFormProps) {
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
    form.reset({ postId, body: "" });
    setFeedback(result.message ?? "Resposta enviada.");
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(handleReply)}
      noValidate
      className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-linha bg-fundo px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:px-8 lg:pb-4"
    >
      <Controller
        name="body"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1.5">
            <FieldLabel htmlFor="resposta" className="sr-only">
              Sua resposta
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                {...field}
                id="resposta"
                placeholder="Escreva uma resposta…"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                onChange={(event) => {
                  setFeedback(null);
                  field.onChange(event);
                }}
                className="h-11 flex-1 rounded-xl border-linha bg-fundo px-3 text-[15px]"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 rounded-xl bg-acao px-4 text-sm font-semibold text-texto hover:bg-acao/90"
              >
                {isSubmitting ? "Enviando…" : "Enviar"}
              </Button>
            </div>
            <FieldError errors={[fieldState.error]} className="text-xs" />
          </Field>
        )}
      />
      {feedback ? (
        <p role="status" className="text-xs text-texto-secundario">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
