"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { SurfaceCard } from "@/components/surface-card";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LevelingOption } from "@/lib/data/entrada";
import { submitButtonClass } from "../../_lib/form-styles";
import { singleChoiceSchema, type SingleChoiceInput } from "../../_lib/schemas";

type LevelingFormProps = {
  questionId: string;
  statement: string;
  options: LevelingOption[];
  nextHref: string;
  submitLabel: string;
};

/**
 * Alternativas da pergunta atual. A letra faz o papel do botão de rádio (o
 * rádio fica só para leitores de tela). Protótipo: a resposta não é salva.
 */
export function LevelingForm({
  questionId,
  statement,
  options,
  nextHref,
  submitLabel,
}: LevelingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SingleChoiceInput>({
    resolver: zodResolver(singleChoiceSchema),
    defaultValues: { choice: "" },
  });

  function handleSubmit() {
    startTransition(() => router.push(nextHref));
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-1 flex-col gap-5"
    >
      <Controller
        name="choice"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid} className="gap-2">
            <FieldLegend className="sr-only">{statement}</FieldLegend>
            <SurfaceCard>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={(value) => field.onChange(String(value))}
                aria-invalid={fieldState.invalid}
                className="gap-0 divide-y divide-linha"
              >
                {options.map((option) => {
                  const inputId = `${questionId}-${option.letter}`;
                  return (
                    <label
                      key={option.letter}
                      htmlFor={inputId}
                      className="group/option flex min-h-14 cursor-pointer items-center gap-3 px-4 py-3 transition-colors has-focus-visible:bg-superficie has-data-checked:bg-trilha/30"
                    >
                      <span className="sr-only">
                        <RadioGroupItem id={inputId} value={option.letter} />
                      </span>
                      <span
                        aria-hidden
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ring-1 ring-linha group-has-data-checked/option:bg-texto group-has-data-checked/option:text-fundo group-has-data-checked/option:ring-texto"
                      >
                        {option.letter}
                      </span>
                      <span className="text-sm leading-snug">{option.text}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </SurfaceCard>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} className="px-4" />
            ) : null}
          </FieldSet>
        )}
      />

      <div className="mt-auto flex flex-col gap-2 px-4">
        <Button type="submit" disabled={isPending} className={submitButtonClass}>
          {submitLabel}
        </Button>
        <p className="text-center text-xs text-texto-secundario">
          O nivelamento só indica por onde começar. Não vale XP.
        </p>
      </div>
    </form>
  );
}
