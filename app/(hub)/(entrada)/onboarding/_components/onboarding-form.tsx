"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { SurfaceCard } from "@/components/surface-card";
import { ColorBurstButton } from "@/components/color-burst-button";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ChoiceOption } from "@/lib/data/entrada";
import { submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED, singleChoiceSchema, type SingleChoiceInput } from "../../_lib/schemas";

type OnboardingFormProps = {
  stepId: string;
  /** Pergunta do passo — vira a legenda (oculta) do grupo de opções. */
  legend: string;
  options: ChoiceOption[];
  /** Para onde vai depois de escolher (próximo passo ou consentimento). */
  nextHref: string;
};

/**
 * Escolha única do passo atual. Protótipo: a resposta não é salva, só libera
 * o avanço para o próximo passo.
 */
export function OnboardingForm({ stepId, legend, options, nextHref }: OnboardingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SingleChoiceInput>({
    resolver: IS_ENTRY_VALIDATION_ENABLED ? zodResolver(singleChoiceSchema) : undefined,
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
            <FieldLegend className="sr-only">{legend}</FieldLegend>
            <SurfaceCard>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={(value) => field.onChange(String(value))}
                aria-invalid={fieldState.invalid}
                className="gap-0 divide-y divide-linha"
              >
                {options.map((option) => {
                  const inputId = `${stepId}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      htmlFor={inputId}
                      className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors lg:px-6 lg:py-4 has-data-checked:bg-acao/15"
                    >
                      <RadioGroupItem id={inputId} value={option.id} className="mt-0.5 size-5" />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold">{option.title}</span>
                        <span className="text-sm text-texto-secundario">{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </SurfaceCard>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} className="px-4 lg:px-0" />
            ) : null}
          </FieldSet>
        )}
      />

      <div className="mt-auto px-4 lg:px-0">
        <ColorBurstButton type="submit" disabled={isPending} className={submitButtonClass}>
          Continuar
        </ColorBurstButton>
      </div>
    </form>
  );
}
