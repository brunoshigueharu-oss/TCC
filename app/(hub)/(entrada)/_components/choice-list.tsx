"use client";

import { Check } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export type Choice = {
  value: string;
  /** Marca à esquerda: "01" no onboarding, "A" no nivelamento. */
  marker: string;
  title: string;
  description?: string;
};

type ChoiceListProps = {
  name: string;
  legend: string;
  choices: Choice[];
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  /** Atalho de teclado: a tecla da marca (1–4 ou A–D) escolhe a opção. */
  hasShortcuts?: boolean;
  describedBy?: string;
};

/**
 * Escolha única como lista com linhas (rádios nativos, acessíveis). A opção
 * marcada ganha fundo suave, filete à esquerda e o visto verde-água.
 */
export function ChoiceList({
  name,
  legend,
  choices,
  value,
  onChange,
  isInvalid = false,
  hasShortcuts = true,
  describedBy,
}: ChoiceListProps) {
  useEffect(() => {
    if (!hasShortcuts) return;
    function handleKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && ["TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (target instanceof HTMLInputElement && target.type !== "radio") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const choice = choices.find((item) => item.marker.toLowerCase().replace(/^0/, "") === event.key.toLowerCase());
      if (choice) {
        onChange(choice.value);
        document.getElementById(`${name}-${choice.value}`)?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [choices, hasShortcuts, name, onChange]);

  return (
    <fieldset aria-invalid={isInvalid} aria-describedby={describedBy} className="flex flex-col">
      <legend className="sr-only">{legend}</legend>
      <div className="divide-y divide-linha border-y border-linha">
        {choices.map((choice) => {
          const isChecked = value === choice.value;
          const inputId = `${name}-${choice.value}`;
          return (
            <label
              key={choice.value}
              htmlFor={inputId}
              className={cn(
                "group/choice relative -mx-4 flex min-h-16 cursor-pointer items-start gap-4 px-4 py-4 transition-colors duration-200 has-focus-visible:bg-superficie lg:-mx-3 lg:px-3",
                isChecked ? "bg-superficie" : "hover:bg-superficie/60",
              )}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={choice.value}
                checked={isChecked}
                onChange={() => onChange(choice.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-0.5 bg-texto transition-opacity duration-200",
                  isChecked ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 w-6 shrink-0 font-mono text-xs tabular-nums transition-colors",
                  isChecked ? "text-texto" : "text-texto-secundario",
                )}
              >
                {choice.marker}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[16px] leading-snug font-medium">{choice.title}</span>
                {choice.description ? (
                  <span className="text-sm leading-snug text-texto-secundario">{choice.description}</span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full transition-[background-color,box-shadow,transform] duration-200",
                  isChecked ? "scale-100 bg-acao text-tinta" : "scale-90 ring-1 ring-linha ring-inset group-hover/choice:ring-texto-secundario",
                )}
              >
                {isChecked ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
