"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { ColorBurstButton } from "@/components/color-burst-button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { EntryHeading } from "../../_components/entry-heading";
import { Switch } from "@/components/ui/switch";
import type { ConsentItem } from "@/lib/data/entrada";
import { FlowProgress } from "../../_components/flow-progress";
import { submitButtonClass } from "../../_lib/form-styles";
import { consentSchema, type ConsentInput } from "../../_lib/schemas";
import { saveConsent } from "../_actions/save-consent";
import { TermsSummary } from "./terms-summary";

type ConsentFormProps = {
  items: ConsentItem[];
  termsSummary: string[];
};

/** Um interruptor por uso de dados + aceite. Nada aqui é obrigatório. */
export function ConsentForm({ items, termsSummary }: ConsentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string>();
  const form = useForm<ConsentInput>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      personalizeTrack: items.some(({ id, isDefaultOn }) => id === "personalizeTrack" && isDefaultOn),
      notifications: items.some(({ id, isDefaultOn }) => id === "notifications" && isDefaultOn),
      emailUpdates: items.some(({ id, isDefaultOn }) => id === "emailUpdates" && isDefaultOn),
    },
  });

  function handleSubmit(values: ConsentInput) {
    setServerMessage(undefined);
    startTransition(async () => {
      const result = await saveConsent(values);
      if (!result.success) setServerMessage(result.message);
    });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(handleSubmit)}
      aria-labelledby="titulo-dados"
      className="flex flex-1 flex-col gap-8"
    >
      <FlowProgress stage="Seus dados" />
      <EntryHeading
        id="titulo-dados"
        eyebrow="Privacidade"
        title="Você decide o que compartilhar."
        description="Nada aqui é obrigatório. Dá para mudar tudo depois em Configurações."
      />

      <div className="flex flex-col">
        <ul className="divide-y divide-linha border-y border-linha">
          {items.map((item) => (
            <li key={item.id}>
              <Controller
                name={item.id}
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal" className="items-center gap-4 py-4">
                    <FieldContent className="gap-0.5">
                      <FieldLabel htmlFor={`consent-${item.id}`} className="cursor-pointer text-[16px] font-medium">
                        {item.title}
                      </FieldLabel>
                      <FieldDescription id={`consent-${item.id}-desc`} className="text-sm text-texto-secundario">
                        {item.description}
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id={`consent-${item.id}`}
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby={`consent-${item.id}-desc`}
                      className="data-checked:bg-acao"
                    />
                  </Field>
                )}
              />
            </li>
          ))}
        </ul>
        <TermsSummary items={termsSummary} />
      </div>

      {serverMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {serverMessage}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 lg:mt-0">
        <ColorBurstButton type="submit" disabled={isPending} className={submitButtonClass}>
          {isPending ? "Salvando…" : "Salvar e continuar"}
        </ColorBurstButton>
        <p className="text-center font-mono text-[11px] text-texto-secundario">
          Ao continuar, você aceita os termos acima.
        </p>
      </div>
    </form>
  );
}
