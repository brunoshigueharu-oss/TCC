"use client";

import { AnimatePresence, motion } from "motion/react";

import type { LandingData } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

type ProductCardPreviewProps = {
  product: LandingData["demo"]["product"];
  /** 0 = prompt vago, 1 = com medidas, 2 = com estados. */
  step: number;
  /** Esmaece enquanto o prompt novo está sendo digitado. */
  isDimmed: boolean;
};

/**
 * Cadeira cantilever desenhada com caracteres: encosto, assento, perna da
 * frente e base. Linhas de mesma largura para o `<pre>` não tremer.
 */
const CHAIR_ART = [
  "  %%                ",
  "  %%                ",
  "  %%                ",
  "  %%                ",
  "  %%%%%%%%%%%%%%%   ",
  "  ##::::::::::::%%  ",
  "               :%%  ",
  "               :%%  ",
  "               :%%  ",
  " %%%%%%%%%%%%%%%%%  ",
].join("\n");

const LAYOUT_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * Card de produto gerado pela "IA" na demonstração. As três versões são o
 * mesmo conjunto de elementos com medidas diferentes; `layout` do motion
 * anima a passagem de uma para outra.
 */
export function ProductCardPreview({ product, step, isDimmed }: ProductCardPreviewProps) {
  const isGeneric = step === 0;
  const hasStates = step === 2;

  return (
    <motion.article
      layout
      transition={LAYOUT_TRANSITION}
      aria-label={`Prévia gerada: card de produto, versão ${step + 1}`}
      className={cn(
        "flex w-full flex-col overflow-hidden bg-fundo transition-opacity duration-300",
        isGeneric
          ? "max-w-[260px] items-center gap-3 rounded-3xl p-4 text-center shadow-[0_18px_40px_-20px_rgb(24_24_27/0.35)] ring-1 ring-linha"
          : "max-w-[300px] gap-4 rounded-xl p-4 ring-1 ring-texto/15",
        isDimmed && "opacity-50",
      )}
    >
      <motion.div
        layout
        transition={LAYOUT_TRANSITION}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden bg-superficie",
          isGeneric ? "aspect-square rounded-2xl" : "aspect-[4/3] rounded-lg",
        )}
      >
        {isGeneric ? (
          <span className="text-xs text-texto-secundario">imagem</span>
        ) : (
          <motion.pre
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-mono text-[10px] leading-[1.05] font-bold text-texto/75 sm:text-[12px]"
          >
            {CHAIR_ART}
          </motion.pre>
        )}
        <AnimatePresence>
          {hasStates ? (
            <motion.span
              key="selo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="absolute top-2 left-2 rounded-full bg-trilha px-2 py-0.5 text-[11px] font-semibold text-tinta"
            >
              {product.tag}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <motion.div
        layout
        transition={LAYOUT_TRANSITION}
        className={cn("flex w-full flex-col", isGeneric ? "items-center gap-1" : "items-start gap-1")}
      >
        <motion.p
          layout="position"
          transition={LAYOUT_TRANSITION}
          className={cn(isGeneric ? "text-[15px] font-semibold" : "font-display text-lg font-medium tracking-[-0.02em]")}
        >
          {isGeneric ? "Produto" : product.name}
        </motion.p>
        <motion.p
          layout="position"
          transition={LAYOUT_TRANSITION}
          className={cn(isGeneric ? "text-xs text-texto-secundario" : "font-mono text-[13px] tabular-nums text-texto-secundario")}
        >
          {isGeneric ? "Descrição do produto aqui" : product.price}
        </motion.p>
      </motion.div>

      <motion.span
        layout
        transition={LAYOUT_TRANSITION}
        className={cn(
          "flex items-center justify-center text-sm font-semibold",
          isGeneric
            ? "h-10 w-full rounded-lg bg-comunidade text-papel"
            : "h-10 self-start rounded-full bg-texto px-5 text-fundo",
          hasStates && "ring-2 ring-acao ring-offset-2 ring-offset-fundo",
        )}
      >
        {product.cta}
      </motion.span>
      <AnimatePresence>
        {hasStates ? (
          <motion.span
            key="foco"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="-mt-2 font-mono text-[10px] text-texto-secundario"
          >
            ↑ estado de foco
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
