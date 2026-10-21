"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { inputClass, labelClass, submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED, loginSchema, type LoginInput } from "../../_lib/schemas";
import { signIn } from "../_actions/sign-in";

/** Formulário de login: e-mail, senha e link de recuperação. */
export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string>();
  const form = useForm<LoginInput>({
    resolver: IS_ENTRY_VALIDATION_ENABLED ? zodResolver(loginSchema) : undefined,
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
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 p-4 lg:p-6">
      <FieldGroup className="gap-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-email" className={labelClass}>
                E-mail
              </FieldLabel>
              <Input
                {...field}
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                aria-invalid={fieldState.invalid}
                className={inputClass}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-password" className={labelClass}>
                Senha
              </FieldLabel>
              <Input
                {...field}
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className={inputClass}
              />
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
            </Field>
          )}
        />
      </FieldGroup>

      <Link
        href="/entrar?recuperar=1"
        className="flex min-h-11 items-center self-end text-sm font-semibold underline underline-offset-4"
      >
        Esqueci a senha
      </Link>

      {serverMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {serverMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending} className={submitButtonClass}>
        {isPending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
