"use client";

import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { optionLetters } from "@/lib/data/proficiencia";
import type { StepQuestion as StepQuestionData } from "@/lib/data/trilha";
import { cn } from "@/lib/utils";

export type QuestionAnswer = {
  selected: number | null;
  /** A alternativa escolhida já foi verificada? */
  isChecked: boolean;
  /** Quantas vezes a pessoa verificou (1 = acertou de primeira). */
  attempts: number;
};

export const emptyAnswer: QuestionAnswer = { selected: null, isChecked: false, attempts: 0 };

type StepQuestionProps = {
  question: StepQuestionData;
  answer: QuestionAnswer;
  onSelect: (index: number) => void;
};

/**
 * Pergunta de múltipla escolha da lição. O retorno aparece abaixo das
 * alternativas, em uma linha sóbria: o que estava certo (ou não) e por quê.
 */
export function StepQuestion({ question, answer, onSelect }: StepQuestionProps) {
  const { selected, isChecked } = answer;
  const isCorrect = isChecked && selected === question.correctIndex;
  const feedback = isChecked && selected !== null ? question.options[selected].feedback : null;

  return (
    <div className="flex flex-col gap-5">
      <p id="pergunta-da-etapa" className="font-display text-[22px] leading-snug font-medium tracking-[-0.02em] lg:text-[26px]">
        {question.prompt}
      </p>

      <div role="radiogroup" aria-labelledby="pergunta-da-etapa" className="flex flex-col border-t border-linha">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isRight = isChecked && isSelected && isCorrect;
          const isWrong = isChecked && isSelected && !isCorrect;

          return (
            <button
              key={option.text}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isChecked}
              onClick={() => onSelect(index)}
              className={cn(
                "group flex min-h-14 items-center gap-4 border-b border-linha py-3 pr-2 text-left outline-none transition-[background-color,padding] duration-200 focus-visible:ring-2 focus-visible:ring-texto",
                isSelected ? "bg-superficie pl-3" : "pl-0 enabled:hover:bg-superficie enabled:hover:pl-3",
                isChecked && !isSelected ? "opacity-50" : "",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs transition-colors duration-200",
                  isRight
                    ? "bg-acao text-tinta"
                    : isWrong
                      ? "bg-texto text-fundo"
                      : isSelected
                        ? "bg-texto text-fundo"
                        : "text-texto-secundario ring-1 ring-linha group-enabled:group-hover:text-texto",
                )}
              >
                {isRight ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : isWrong ? (
                  <X className="size-3.5" strokeWidth={2.5} />
                ) : (
                  optionLetters[index]
                )}
              </span>
              <span className="text-[15px] leading-snug lg:text-base">{option.text}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        <AnimatePresence initial={false} mode="wait">
          {feedback ? (
            <motion.div
              key={`${selected}-${answer.attempts}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn("flex flex-col gap-1 border-l-2 py-0.5 pl-4", isCorrect ? "border-acao" : "border-texto")}
            >
              <p className="text-xs font-semibold tracking-[0.08em] uppercase">
                {isCorrect ? "Resposta certa" : "Ainda não"}
              </p>
              <p className="text-[15px] leading-relaxed text-texto-secundario">{feedback}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
