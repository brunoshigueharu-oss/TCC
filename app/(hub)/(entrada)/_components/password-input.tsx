"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { inputClass } from "../_lib/form-styles";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

/** Campo de senha com botão de mostrar/ocultar (anuncia o estado ao leitor de tela). */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={isVisible ? "text" : "password"} className={cn(inputClass, "pr-12", className)} />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-pressed={isVisible}
        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute top-0.5 right-0.5 flex size-11 items-center justify-center rounded-xl text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
      >
        {isVisible ? (
          <EyeOff aria-hidden className="size-[18px]" strokeWidth={1.75} />
        ) : (
          <Eye aria-hidden className="size-[18px]" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
