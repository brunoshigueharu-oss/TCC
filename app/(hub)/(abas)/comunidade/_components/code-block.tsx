"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import type { Snippet } from "@/lib/data/comunidade";
import { cn } from "@/lib/utils";

/** Quanto tempo (ms) o botão mostra "Copiado" antes de voltar. */
const COPIED_FEEDBACK_MS = 1800;

type CodeBlockProps = {
  snippet: Snippet;
  className?: string;
};

/**
 * Bloco de prompt ou de código: barra com o rótulo em mono e "Copiar", linhas
 * numeradas e texto em Geist Mono. Prompts quebram linha; código rola na
 * horizontal para não mexer na indentação.
 */
export function CodeBlock({ snippet, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isPrompt = snippet.kind === "prompt";
  const lines = snippet.content.split("\n");

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(
      () => setIsCopied(false),
      COPIED_FEEDBACK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setIsCopied(true);
    } catch {
      // Sem permissão de área de transferência: o texto continua selecionável.
    }
  }

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-linha bg-superficie",
        className,
      )}
    >
      <figcaption className="flex h-10 items-center justify-between gap-3 border-b border-linha pr-1 pl-4">
        <span className="flex min-w-0 items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-texto-secundario uppercase">
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-[1px]",
              isPrompt ? "bg-acao" : "bg-comunidade",
            )}
          />
          <span className="truncate">{snippet.label}</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 font-mono text-[11px] text-texto-secundario outline-none transition-colors hover:bg-superficie-forte hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
        >
          {isCopied ? (
            <Check aria-hidden className="size-3.5" strokeWidth={2} />
          ) : (
            <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
          )}
          <span aria-live="polite">{isCopied ? "Copiado" : "Copiar"}</span>
        </button>
      </figcaption>
      <pre
        tabIndex={0}
        className={cn(
          "py-3.5 font-mono text-[13px] leading-[1.7] outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-inset",
          isPrompt ? "whitespace-pre-wrap" : "overflow-x-auto",
        )}
      >
        <code className="grid grid-cols-[auto_minmax(0,1fr)]">
          {lines.map((line, index) => (
            <span key={index} className="contents">
              <span
                aria-hidden
                className="pr-3 pl-4 text-right text-desativado tabular-nums select-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "pr-4",
                  isPrompt ? "break-words" : "whitespace-pre",
                )}
              >
                {line || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
