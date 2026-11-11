"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const FEEDBACK_MS = 1600;

type CopyButtonProps = {
  /** Texto que vai para a área de transferência. */
  text: string;
  label?: string;
  className?: string;
};

/** Botão discreto de copiar, com confirmação curta ("Copiado"). */
export function CopyButton({ text, label = "Copiar", className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Sem permissão de área de transferência: não confirma a cópia.
      return;
    }
    setIsCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setIsCopied(false), FEEDBACK_MS);
  }

  const Icon = isCopied ? Check : Copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 font-mono text-[11px] tracking-wide text-texto-secundario uppercase outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.97]",
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2} />
      <span aria-live="polite">{isCopied ? "Copiado" : label}</span>
    </button>
  );
}
