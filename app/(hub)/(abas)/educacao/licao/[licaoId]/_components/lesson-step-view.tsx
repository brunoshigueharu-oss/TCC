"use client";

import type { GlossaryEntry, LessonStep, LessonStepKind } from "@/lib/data/trilha";
import type { PlaygroundScenario } from "@/lib/data/playground";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "../../../_components/prompt-playground/before-after";
import { PromptPlayground } from "../../../_components/prompt-playground/prompt-playground";
import { GlossaryText } from "./glossary-text";
import { StepQuestion, type QuestionAnswer } from "./step-question";
import { CodeBlock, PromptBlock } from "./text-blocks";

export const stepKindLabel: Record<LessonStepKind, string> = {
  leitura: "Leitura",
  comparacao: "Comparação",
  pergunta: "Pergunta",
  playground: "Prática",
};

/** Etapas que pedem largura total; as demais ficam na coluna de leitura. */
export function isWideStep(step: LessonStep) {
  return step.kind === "playground" || step.kind === "comparacao";
}

type LessonStepViewProps = {
  step: LessonStep;
  index: number;
  total: number;
  glossary: GlossaryEntry[];
  scenario: PlaygroundScenario;
  answer: QuestionAnswer;
  onSelectOption: (index: number) => void;
};

/** Uma etapa da lição: rótulo em mono, título, texto e o bloco da etapa. */
export function LessonStepView({
  step,
  index,
  total,
  glossary,
  scenario,
  answer,
  onSelectOption,
}: LessonStepViewProps) {
  return (
    <article
      aria-labelledby="titulo-da-etapa"
      className={cn("flex flex-col gap-6", isWideStep(step) ? "max-w-none" : "max-w-[640px]")}
    >
      <header className={cn("flex flex-col gap-3", isWideStep(step) ? "max-w-[640px]" : "")}>
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
          <span>
            Etapa {formatTwoDigits(index + 1)} / {formatTwoDigits(total)}
          </span>
          <span aria-hidden className="h-px w-6 bg-linha" />
          <span>{stepKindLabel[step.kind]}</span>
        </p>
        {step.title ? (
          <h2
            id="titulo-da-etapa"
            className="font-display text-[30px] leading-[1.05] font-medium tracking-[-0.035em] text-balance lg:text-[40px]"
          >
            {step.title}
          </h2>
        ) : (
          <h2 id="titulo-da-etapa" className="sr-only">
            Etapa {index + 1}
          </h2>
        )}
        <p className="text-[17px] leading-[1.7] text-texto lg:text-lg lg:leading-[1.7]">
          <GlossaryText text={step.body} glossary={glossary} />
        </p>
      </header>

      {step.kind === "pergunta" && step.question ? (
        <StepQuestion question={step.question} answer={answer} onSelect={onSelectOption} />
      ) : null}
      {step.kind === "comparacao" ? <BeforeAfter scenario={scenario} /> : null}
      {step.kind === "playground" ? <PromptPlayground scenario={scenario} /> : null}
      {step.promptExample ? <PromptBlock text={step.promptExample} /> : null}
      {step.code ? <CodeBlock label={step.code.label} content={step.code.content} /> : null}
    </article>
  );
}
