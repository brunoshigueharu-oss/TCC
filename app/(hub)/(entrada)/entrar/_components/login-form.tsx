"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PasswordInput } from "../../_components/password-input";
import { inputClass, labelClass, submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED, isValidEmail, loginSchema, type LoginInput } from "../../_lib/schemas";
import { signIn } from "../_actions/sign-in";

/** Formulário de login: e-mail (com confirmação ao vivo), senha e recuperação. */
export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string>();
  const form = useForm<LoginInput>({
    resolver: IS_ENTRY_VALIDATION_ENABLED ? zodResolver(loginSchema) : undefined,
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  function handleSubmit(values: LoginInput) {
    setServerMessage(undefined);
    startTransition(async () => {
      const result = await signIn(values);
      if (!result.success) setServerMessage(result.message);
    });
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)} aria-labelledby="titulo-entrar" className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => {
            const isEmailOk = isValidEmail(field.value);
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email" className={labelClass}>
                  E-mail
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    aria-invalid={fieldState.invalid}
                    className={cn(inputClass, "pr-11")}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center rounded-[4px] bg-acao text-tinta transition-[opacity,transform] duration-200",
                      isEmailOk ? "scale-100 opacity-100" : "scale-75 opacity-0",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                </div>
                <FieldError errors={[fieldState.error]} className="text-[13px]" />
              </Field>
            );
          }}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-baseline justify-between">
                <FieldLabel htmlFor="login-password" className={labelClass}>
                  Senha
                </FieldLabel>
                <Link
                  href="/entrar?recuperar=1"
                  scroll={false}
                  className="-my-3 flex min-h-11 items-center text-[13px] text-texto-secundario underline-offset-4 outline-none hover:text-texto hover:underline focus-visible:underline"
                >
                  Esqueci a senha
                </Link>
              </div>
              <PasswordInput
                {...field}
                id="login-password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
              />
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
        {isPending ? "Entrando…" : "Entrar"}
      </ColorBurstButton>
    </form>
  );
}
