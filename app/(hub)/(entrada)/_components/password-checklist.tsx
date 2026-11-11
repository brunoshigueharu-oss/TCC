import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PASSWORD_MIN_LENGTH } from "../_lib/schemas";

type PasswordChecklistProps = {
  id: string;
  password: string;
};

/** Requisitos da senha que se cumprem enquanto a pessoa digita. */
export function PasswordChecklist({ id, password }: PasswordChecklistProps) {
  const rules = [
    { label: `${PASSWORD_MIN_LENGTH} caracteres ou mais`, isMet: password.length >= PASSWORD_MIN_LENGTH },
    { label: "uma letra", isMet: /[a-zA-ZÀ-ÿ]/.test(password) },
    { label: "um número", isMet: /\d/.test(password) },
  ];
  const metCount = rules.filter((rule) => rule.isMet).length;

  return (
    <div id={id} className="flex flex-col gap-2">
      <span aria-hidden className="grid grid-cols-3 gap-1">
        {rules.map((rule, index) => (
          <span
            key={rule.label}
            className={cn(
              "h-0.5 rounded-full transition-colors duration-300",
              index < metCount ? (metCount === rules.length ? "bg-acao" : "bg-texto") : "bg-linha",
            )}
          />
        ))}
      </span>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {rules.map((rule) => (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 font-mono text-[11px] transition-colors duration-200",
              rule.isMet ? "text-texto" : "text-texto-secundario",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-3 items-center justify-center rounded-[3px] transition-colors duration-200",
                rule.isMet ? "bg-acao text-tinta" : "ring-1 ring-linha ring-inset",
              )}
            >
              {rule.isMet ? <Check className="size-2.5" strokeWidth={3.5} /> : null}
            </span>
            {rule.label}
            <span className="sr-only">{rule.isMet ? ", cumprido" : ", pendente"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
