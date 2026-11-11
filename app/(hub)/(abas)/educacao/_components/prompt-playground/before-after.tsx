"use client";

import { ChevronsLeftRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { buildPromptText, createEdgePromptStates, type PlaygroundScenario } from "@/lib/data/playground";
import { GeneratedPreview } from "./generated-preview";

const INITIAL_PERCENT = 50;

type BeforeAfterProps = {
  scenario: PlaygroundScenario;
};

/**
 * "Antes e depois" de um prompt: o resultado do pedido vago e o do pedido
 * preciso, sobrepostos, com uma divisória que a pessoa arrasta (ou move com
 * as setas do teclado, pois por baixo é um `input type="range"`).
 */
export function BeforeAfter({ scenario }: BeforeAfterProps) {
  const { vague, precise } = createEdgePromptStates();
  const percent = useMotionValue(INITIAL_PERCENT);
  const clipPath = useMotionTemplate`inset(0 0 0 ${percent}%)`;
  const left = useMotionTemplate`${percent}%`;

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative h-[360px] overflow-hidden rounded-xl border border-linha bg-superficie select-none">
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
          <GeneratedPreview scenario={scenario} state={vague} />
        </div>
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 flex items-center justify-center bg-superficie p-6 sm:p-10"
        >
          <GeneratedPreview scenario={scenario} state={precise} />
        </motion.div>

        <span className="absolute top-3 left-3 rounded-full bg-fundo px-2.5 py-1 font-mono text-[10px] tracking-wide uppercase ring-1 ring-linha">
          Antes
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-texto px-2.5 py-1 font-mono text-[10px] tracking-wide text-fundo uppercase">
          Depois
        </span>

        <motion.div aria-hidden style={{ left }} className="pointer-events-none absolute inset-y-0 w-px bg-texto">
          <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-texto text-fundo">
            <ChevronsLeftRight className="size-4" strokeWidth={2} />
          </span>
        </motion.div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          defaultValue={INITIAL_PERCENT}
          onChange={(event) => percent.set(Number(event.target.value))}
          aria-label="Divisória entre o resultado do prompt vago e o do prompt preciso"
          className="peer absolute inset-0 size-full cursor-ew-resize touch-pan-y opacity-0"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl ring-texto ring-inset peer-focus-visible:ring-2"
        />
      </div>

      <figcaption className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 border-t border-linha pt-3">
          <span className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">Prompt vago</span>
          <p className="font-mono text-[13px] leading-relaxed">{buildPromptText(scenario, vague)}</p>
        </div>
        <div className="flex flex-col gap-1.5 border-t border-texto pt-3">
          <span className="text-xs font-semibold tracking-[0.08em] uppercase">Prompt preciso</span>
          <p className="font-mono text-[13px] leading-relaxed">{buildPromptText(scenario, precise)}</p>
        </div>
      </figcaption>
    </figure>
  );
}
