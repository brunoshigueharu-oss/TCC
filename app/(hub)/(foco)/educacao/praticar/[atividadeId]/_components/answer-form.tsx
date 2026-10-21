"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { activityAnswerSchema, type ActivityAnswer } from "@/lib/data/praticar";
import { submitActivity } from "../_actions/submit-activity";

type AnswerFormProps = {
  activityId: string;
};

/** Campo da resposta (prompt ou código) + link opcional, enviados para avaliação. */
export function AnswerForm({ activityId }: AnswerFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ActivityAnswer>({
    resolver: zodResolver(activityAnswerSchema),
    defaultValues: { answer: "", link: "" },
  });

  function handleSubmit(values: ActivityAnswer) {
    startTransition(async () => {
      const result = await submitActivity(activityId, values);
      if (result.success) return;

      result.errors?.answer?.forEach((message) => form.setError("answer", { message }));
      result.errors?.link?.forEach((message) => form.setError("link", { message }));
      if (!result.errors && result.message) form.setError("root", { message: result.message });
    });
  }

  return (
    <section aria-labelledby="sua-resposta" className="flex flex-col gap-2 lg:col-span-2">
      <SectionHeading id="sua-resposta" title="Sua resposta" icon={PenLine} tone="pratica" />
      <SurfaceCard className="p-4 lg:p-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="answer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="resposta">Prompt ou código</FieldLabel>
                  <Textarea
                    {...field}
                    id="resposta"
                    rows={6}
                    aria-invalid={fieldState.invalid}
                    placeholder="Escreva o prompt ou cole o código aqui…"
                    className="min-h-36 rounded-xl border-linha bg-fundo px-3 py-2.5 text-[15px] md:text-[15px] lg:min-h-56"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="link"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="link">Link do resultado (opcional)</FieldLabel>
                  <Input
                    {...field}
                    id="link"
                    type="url"
                    inputMode="url"
                    aria-invalid={fieldState.invalid}
                    placeholder="https://"
                    className="h-11 rounded-xl border-linha bg-fundo px-3 text-[15px] md:text-[15px]"
                  />
                  <FieldDescription className="text-xs text-texto-secundario">
                    Protótipo publicado, repositório ou captura de tela.
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <FieldError errors={[form.formState.errors.root]} />
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-xl bg-acao text-[15px] font-semibold text-texto hover:bg-acao/90 lg:w-auto lg:min-w-56 lg:self-end lg:px-8"
            >
              {isPending ? "Enviando…" : "Enviar para avaliação"}
            </Button>
          </FieldGroup>
        </form>
      </SurfaceCard>
    </section>
  );
}
