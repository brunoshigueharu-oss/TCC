"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { accountSchema, type AccountInput } from "@/lib/data/perfil";
import { updateAccount } from "../_actions/update-account";

type AccountFormProps = {
  defaultValues: AccountInput;
};

type AccountField = {
  name: keyof AccountInput;
  label: string;
  type: "text" | "email";
  autoComplete: string;
};

const fields: AccountField[] = [
  { name: "name", label: "Nome", type: "text", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "role", label: "Área de atuação", type: "text", autoComplete: "organization-title" },
];

const inputClass = "h-11 rounded-xl border-linha bg-fundo px-3 text-[15px] md:text-[15px]";

/** Formulário "Dados da conta": RHF + Zod no cliente e Server Action no envio. */
export function AccountForm({ defaultValues }: AccountFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const form = useForm<AccountInput>({
    resolver: zodResolver(accountSchema),
    defaultValues,
  });

  function handleSubmit(values: AccountInput) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateAccount(values);
      if (result.errors) {
        for (const field of fields) {
          const [message] = result.errors[field.name] ?? [];
          if (message) form.setError(field.name, { message });
        }
      }
      if (result.success) form.reset(values);
      setFeedback(result.message ?? null);
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-5 p-4">
      <FieldGroup className="gap-4">
        {fields.map((item) => (
          <Controller
            key={item.name}
            name={item.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`conta-${item.name}`} className="text-sm font-semibold">
                  {item.label}
                </FieldLabel>
                <Input
                  {...field}
                  id={`conta-${item.name}`}
                  type={item.type}
                  autoComplete={item.autoComplete}
                  aria-invalid={fieldState.invalid}
                  className={inputClass}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        ))}
      </FieldGroup>

      <Button
        type="submit"
        disabled={isPending || !form.formState.isDirty}
        className="h-12 w-full rounded-xl bg-acao text-[15px] font-semibold text-texto hover:bg-acao/90"
      >
        {isPending ? "Salvando..." : "Salvar alterações"}
      </Button>
      <p role="status" className="-mt-2 text-center text-sm text-texto-secundario empty:hidden">
        {feedback}
      </p>
    </form>
  );
}
