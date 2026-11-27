"use client";

import { motion } from "motion/react";

import type { OutputLine } from "@/lib/data/playground";
import { cn } from "@/lib/utils";

type GeneratedCodeProps = {
  lines: OutputLine[];
};

/**
 * Resposta simulada da IA, linha a linha. A linha que mudou desde a última
 * geração pisca em limão por um instante, para ligar o trecho do prompt ao
 * que ele alterou no código.
 */
export function GeneratedCode({ lines }: GeneratedCodeProps) {
  return (
    <div
      role="region"
      aria-label="Resposta simulada da IA"
      tabIndex={0}
      className="max-h-[420px] overflow-auto rounded-xl border border-linha bg-fundo py-3 outline-none focus-visible:ring-2 focus-visible:ring-texto"
    >
      <ol className="min-w-max font-code text-[12.5px] leading-[1.7]">
        {lines.map((line, index) => (
          <li key={`${index}-${line.text}`} className="relative flex gap-4 pr-4 pl-3">
            <motion.span
              aria-hidden
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 bg-trilha"
            />
            <span aria-hidden className="relative w-5 shrink-0 text-right text-desativado tabular-nums select-none">
              {index + 1}
            </span>
            <span
              className={cn(
                "relative whitespace-pre",
                line.kind === "conversa" ? "font-texto text-[13px] text-texto-secundario italic" : "text-texto",
              )}
            >
              {line.text || " "}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
