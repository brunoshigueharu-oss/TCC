"use client";

import { useState, useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import type { PreferenceKey, Preferences } from "@/lib/data/perfil";
import { updatePreference } from "../_actions/update-preference";

export type PreferenceItem = {
  key: PreferenceKey;
  label: string;
  description?: string;
};

type PreferenceSwitchesProps = {
  items: PreferenceItem[];
  initialValues: Preferences;
};

/**
 * Lista de interruptores em linhas. Cada troca vai para a Server
 * Action; se ela recusar, o interruptor volta ao estado anterior.
 */
export function PreferenceSwitches({ items, initialValues }: PreferenceSwitchesProps) {
  const [values, setValues] = useState(initialValues);
  const [hasError, setHasError] = useState(false);
  const [, startTransition] = useTransition();

  function handleChange(key: PreferenceKey, value: boolean) {
    setValues((current) => ({ ...current, [key]: value }));
    setHasError(false);
    startTransition(async () => {
      const result = await updatePreference({ key, value });
      if (!result.success) {
        setValues((current) => ({ ...current, [key]: !value }));
        setHasError(true);
      }
    });
  }

  return (
    <>
      <ul className="divide-y divide-linha">
        {items.map((item) => {
          const labelId = `preferencia-${item.key}`;
          return (
            <li key={item.key}>
              <div className="flex min-h-16 items-center gap-4 py-3">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span id={labelId} className="text-[15px] font-medium">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-sm leading-snug text-texto-secundario">{item.description}</span>
                  ) : null}
                </span>
                <Switch
                  aria-labelledby={labelId}
                  className="data-checked:bg-acao data-unchecked:bg-superficie-forte"
                  checked={values[item.key]}
                  onCheckedChange={(checked) => handleChange(item.key, checked)}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {hasError ? (
        <p role="alert" className="border-t border-linha py-3 text-sm font-medium">
          Não foi possível salvar. Tente de novo.
        </p>
      ) : null}
    </>
  );
}
