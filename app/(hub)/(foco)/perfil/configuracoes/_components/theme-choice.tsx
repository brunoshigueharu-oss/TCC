"use client";

import { Moon, Sun } from "lucide-react";

import { setDarkTheme, useIsDarkTheme } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const options = [
  { value: false, label: "Claro", icon: Sun },
  { value: true, label: "Escuro", icon: Moon },
] as const;

/**
 * Escolha do tema em linha de configurações: dois botões segmentados. Vale na
 * hora e fica salvo neste navegador (ver `components/theme-toggle.tsx`).
 */
export function ThemeChoice() {
  const isDark = useIsDarkTheme();

  return (
    <div className="flex min-h-16 items-center gap-4 py-3">
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span id="tema-rotulo" className="text-[15px] font-medium">
          Tema
        </span>
        <span className="text-sm text-texto-secundario">Vale para este navegador.</span>
      </span>
      <div role="radiogroup" aria-labelledby="tema-rotulo" className="flex rounded-full border border-linha p-0.5">
        {options.map(({ value, label, icon: Icon }) => {
          const isSelected = isDark === value;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setDarkTheme(value)}
              className={cn(
                "flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-texto",
                isSelected ? "bg-texto text-fundo" : "text-texto-secundario hover:text-texto",
              )}
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
