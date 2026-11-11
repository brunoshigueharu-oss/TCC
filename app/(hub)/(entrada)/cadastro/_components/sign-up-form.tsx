"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PasswordChecklist } from "../../_components/password-checklist";
import { PasswordInput } from "../../_components/password-input";
import { inputClass, labelClass, submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED, isValidEmail, signUpSchema, type SignUpInput } from "../../_lib/schemas";
import { signUp } from "../_actions/sign-up";

/** Marca verde-água que aparece dentro do campo quando o valor já está bom. */
function ValidMark({ isVisible }: { isVisible: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center rounded-[4px] bg-acao text-tinta transition-[opacity,transform] duration-200",
        isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0",
      )}
    >
      <Check className="size-3" strokeWidth={3} />
    </span>
  );
}

/**
 * Cadastro: nome, e-mail, senha (com requisitos que se cumprem ao digitar) e
 * aceite dos termos. Erros aparecem ao sair do campo e são anunciados.
 */
export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string>();
  const form = useForm<SignUpInput>({
    resolver: IS_ENTRY_VALIDATION_ENABLED ? zodResolver(signUpSchema) : undefined,
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", acceptedTerms: false },
  });

  function handleSubmit(values: SignUpInput) {
    setServerMessage(undefined);
    startTransition(async () => {
      const result = await signUp(values);
      if (!result.success) setServerMessage(result.message);
    });
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)} aria-labelledby="titulo-cadastro" className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cadastro-name" className={labelClass}>
                Nome
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="cadastro-name"
                  autoComplete="name"
                  placeholder="Como quer ser chamado na turma"
                  aria-invalid={fieldState.invalid}
                  className={cn(inputClass, "pr-11")}
                />
                <ValidMark isVisible={field.value.trim().length >= 2} />
              </div>
              <FieldError errors={[fieldState.error]} className="text-[13px]" />
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cadastro-email" className={labelClass}>
                E-mail
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="cadastro-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  aria-invalid={fieldState.invalid}
                  className={cn(inputClass, "pr-11")}
                />
                <ValidMark isVisible={isValidEmail(field.value)} />
              </div>
              <FieldError errors={[fieldState.error]} className="text-[13px]" />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2.5">
              <FieldLabel htmlFor="cadastro-password" className={labelClass}>
                Senha
              </FieldLabel>
              <PasswordInput
                {...field}
                id="cadastro-password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                aria-describedby="cadastro-password-regras"
              />
              <PasswordChecklist id="cadastro-password-regras" password={field.value} />
              <FieldError errors={[fieldState.error]} className="text-[13px]" />
            </Field>
          )}
        />

        <Controller
          name="acceptedTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="cadastro-termos"
                className="flex min-h-11 w-full cursor-pointer items-start gap-3 text-[13px] leading-snug font-normal text-texto-secundario"
              >
                <Checkbox
                  id="cadastro-termos"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    field.onBlur();
                  }}
                  aria-invalid={fieldState.invalid}
                  className="mt-px size-[18px] rounded-[5px] data-checked:border-texto data-checked:bg-texto data-checked:text-fundo"
                />
                Li e aceito os Termos de uso e a Política de privacidade.
              </FieldLabel>
              <FieldError errors={[fieldState.error]} className="text-[13px]" />
            </Field>
          )}
        />
      </FieldGroup>

      {serverMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {serverMessage}
        </p>
      ) : null}

      <ColorBurstButton type="submit" disabled={isPending} className={submitButtonClass}>
        {isPending ? "Criando conta…" : "Criar conta"}
      </ColorBurstButton>
    </form>
  );
}
