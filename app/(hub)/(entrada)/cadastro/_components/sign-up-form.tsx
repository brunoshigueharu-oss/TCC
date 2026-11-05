"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { inputClass, labelClass, submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED, PASSWORD_MIN_LENGTH, signUpSchema, type SignUpInput } from "../../_lib/schemas";
import { signUp } from "../_actions/sign-up";

type TextFieldName = "name" | "email" | "password";

type TextFieldConfig = {
  name: TextFieldName;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  placeholder?: string;
  description?: string;
};

const textFields: TextFieldConfig[] = [
  { name: "name", label: "Nome", type: "text", autoComplete: "name", placeholder: "Seu nome" },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    autoComplete: "email",
    placeholder: "voce@email.com",
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    autoComplete: "new-password",
    description: `Mínimo de ${PASSWORD_MIN_LENGTH} caracteres.`,
  },
];

/** Formulário de cadastro: nome, e-mail, senha e aceite dos termos. */
export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string>();
  const form = useForm<SignUpInput>({
    resolver: IS_ENTRY_VALIDATION_ENABLED ? zodResolver(signUpSchema) : undefined,
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
    <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 p-4 lg:p-6">
      <FieldGroup className="gap-4">
        {textFields.map((config) => (
          <Controller
            key={config.name}
            name={config.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`cadastro-${config.name}`} className={labelClass}>
                  {config.label}
                </FieldLabel>
                <Input
                  {...field}
                  id={`cadastro-${config.name}`}
                  type={config.type}
                  autoComplete={config.autoComplete}
                  placeholder={config.placeholder}
                  aria-invalid={fieldState.invalid}
                  className={inputClass}
                />
                {config.description ? (
                  <FieldDescription className="text-xs">{config.description}</FieldDescription>
                ) : null}
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
        ))}

        <Controller
          name="acceptedTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="cadastro-termos"
                className="flex min-h-11 w-full items-start gap-3 text-sm leading-snug font-normal"
              >
                <Checkbox
                  id="cadastro-termos"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  className="mt-0.5 size-5 rounded-md"
                />
                Li e aceito os Termos de uso e a Política de privacidade.
              </FieldLabel>
              {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
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
