"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { FieldError } from "@/components/ui/field";
import type { OnboardingStep } from "@/lib/data/entrada";
import { ChoiceList } from "../../_components/choice-list";
import { FlowProgress } from "../../_components/flow-progress";
import { IS_ENTRY_VALIDATION_ENABLED, singleChoiceSchema, type SingleChoiceInput } from "../../_lib/schemas";

type OnboardingFormProps = {
  step: OnboardingStep;
  position: number;
  total: number;
  /** Para onde vai depois de escolher (próximo passo ou consentimento). */
  nextHref: string;
  /** Passo anterior; `null` no primeiro. */
  previousHref: string | null;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Um passo do onboarding: pergunta grande e opções em lista. Cada passo
 * entra deslizando de leve; 1–4 no teclado escolhem a opção. Protótipo: a
 * resposta não é salva, só libera o avanço.
 */
export function OnboardingForm({ step, position, total, nextHref, previousHref }: OnboardingFormProps) {
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
    <MotionConfig reducedMotion="user">
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
        aria-labelledby="titulo-passo"
        className="flex flex-1 flex-col gap-8"
      >
        <FlowProgress stage="Perfil" step={position} steps={total} />

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <h1
              id="titulo-passo"
              className="font-display text-[32px] leading-[1.04] font-medium tracking-[-0.04em] text-balance lg:text-[40px]"
            >
              {step.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-texto-secundario">{step.description}</p>
          </div>

          <Controller
            name="choice"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <ChoiceList
                  name={`${step.id}-escolha`}
                  legend={step.title}
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                  choices={step.options.map((option, index) => ({
                    value: option.id,
                    marker: String(index + 1).padStart(2, "0"),
                    title: option.title,
                    description: option.description,
                  }))}
                />
                <FieldError errors={[fieldState.error]} className="text-[13px]" />
              </div>
            )}
          />
        </motion.div>

        <div className="mt-auto flex items-center gap-3 lg:mt-2">
          {previousHref ? (
            <Link
              href={previousHref}
              aria-label="Voltar ao passo anterior"
              className="flex size-12 shrink-0 items-center justify-center rounded-full ring-1 ring-linha outline-none transition-colors hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto"
            >
              <ArrowLeft aria-hidden className="size-5" strokeWidth={1.75} />
            </Link>
          ) : null}
          <ColorBurstButton type="submit" disabled={isPending} className="min-w-0 flex-1">
            {position === total ? "Concluir perfil" : "Continuar"}
          </ColorBurstButton>
        </div>
        <p aria-hidden className="hidden font-mono text-[11px] text-texto-secundario lg:block">
          Atalho: 1–{step.options.length} escolhe · Enter continua
        </p>
      </form>
    </MotionConfig>
  );
}
