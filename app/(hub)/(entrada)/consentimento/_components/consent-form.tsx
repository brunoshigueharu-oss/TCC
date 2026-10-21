"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import { SurfaceCard } from "@/components/surface-card";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { ConsentItem } from "@/lib/data/entrada";
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
      className="flex flex-1 flex-col gap-5"
    >
      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {items.map((item) => (
            <li key={item.id}>
              <Controller
                name={item.id}
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal" className="items-center gap-4 px-4 py-3.5 lg:px-6 lg:py-4">
                    <FieldContent className="gap-0.5">
                      <FieldLabel htmlFor={`consent-${item.id}`} className="text-[15px] font-semibold">
                        {item.title}
                      </FieldLabel>
                      <FieldDescription className="text-sm text-texto-secundario">
                        {item.description}
                      </FieldDescription>
                    </FieldContent>
                    <Switch
                      id={`consent-${item.id}`}
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </li>
          ))}
        </ul>
        <TermsSummary items={termsSummary} />
      </SurfaceCard>

      {serverMessage ? (
        <p role="alert" className="px-4 text-sm text-destructive lg:px-0">
          {serverMessage}
        </p>
      ) : null}

      <div className="mt-auto px-4 lg:px-0">
        <Button type="submit" disabled={isPending} className={submitButtonClass}>
          {isPending ? "Salvando…" : "Aceitar e continuar"}
        </Button>
      </div>
    </form>
  );
}
