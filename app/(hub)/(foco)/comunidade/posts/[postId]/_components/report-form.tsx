"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstLink } from "@/components/color-burst-link";
import { ColorBurstButton } from "@/components/color-burst-button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { reportPost } from "../_actions/report-post";
import {
  reportReasons,
  reportSchema,
  type ReportFormValues,
  type ReportInput,
} from "../_actions/report-schema";

type ReportFormProps = {
  postId: string;
  closeHref: string;
};

/** Motivos da denúncia + detalhes opcionais. Envia por Server Action. */
export function ReportForm({ postId, closeHref }: ReportFormProps) {
  const form = useForm<ReportFormValues, unknown, ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: { postId, reason: "", details: "" },
  });

  async function handleReport(values: ReportInput) {
    // Em caso de sucesso a action redireciona de volta ao post.
    const result = await reportPost(values);
    if (result.errors?.reason?.[0]) form.setError("reason", { message: result.errors.reason[0] });
    if (result.errors?.details?.[0]) form.setError("details", { message: result.errors.details[0] });
    if (!result.success && result.message) form.setError("root", { message: result.message });
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form onSubmit={form.handleSubmit(handleReport)} noValidate className="flex flex-col gap-5">
      <Controller
        name="reason"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend className="sr-only">Motivo</FieldLegend>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
              aria-invalid={fieldState.invalid}
              className="gap-0"
            >
              {reportReasons.map((reason) => (
                <Field key={reason.value} orientation="horizontal" className="min-h-11 gap-3">
                  <RadioGroupItem
                    value={reason.value}
                    id={`motivo-${reason.value}`}
                    className="size-5 border-texto data-checked:border-texto data-checked:bg-texto"
                  />
                  <FieldLabel htmlFor={`motivo-${reason.value}`} className="text-[15px] font-normal">
                    {reason.label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        )}
      />

      <Controller
        name="details"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="detalhes-denuncia">Detalhes (opcional)</FieldLabel>
            <Textarea
              {...field}
              id="detalhes-denuncia"
              placeholder="Conte mais, se quiser…"
              aria-invalid={fieldState.invalid}
              className="min-h-24 rounded-xl border-linha px-3 py-2.5 text-[15px]"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {form.formState.errors.root?.message ? (
        <p role="alert" className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <ColorBurstLink href={closeHref} scroll={false} variant="secondary">
          Cancelar
        </ColorBurstLink>
        <ColorBurstButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando…" : "Enviar denúncia"}
        </ColorBurstButton>
      </div>
    </form>
  );
}
