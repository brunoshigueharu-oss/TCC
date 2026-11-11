"use client";

import { RotateCcw } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState, type FormEvent } from "react";

import { ActionLink } from "@/components/action-link";
import { ColorBurstButton } from "@/components/color-burst-button";
import type { LevelingQuestion, LevelingResult } from "@/lib/data/entrada";
import { cn } from "@/lib/utils";
import { ChoiceList } from "../../_components/choice-list";
import { FlowProgress } from "../../_components/flow-progress";
import { submitButtonClass } from "../../_lib/form-styles";
import { IS_ENTRY_VALIDATION_ENABLED } from "../../_lib/schemas";
import { LevelingTranscript, type LevelingAnswer } from "./leveling-transcript";

const EASE = [0.22, 1, 0.36, 1] as const;

type LevelingConversationProps = {
  questions: LevelingQuestion[];
  results: LevelingResult[];
  initialIndex: number;
};

/**
 * Nivelamento em forma de conversa: a pergunta atual em destaque, as
 * anteriores viram transcrição acima e, no fim, o ponto de partida. Sem
 * pontos, sem "acertou": a pessoa só vê por onde começar. A–D escolhem,
 * Enter responde. Estado só no navegador (protótipo).
 */
export function LevelingConversation({ questions, results, initialIndex }: LevelingConversationProps) {
  const [answers, setAnswers] = useState<LevelingAnswer[]>([]);
  const [index, setIndex] = useState(initialIndex);
  const [choice, setChoice] = useState("");
  const [hasError, setHasError] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFinished = index >= questions.length;
  const question = questions[Math.min(index, questions.length - 1)];

  // Posição na URL, sem recarregar a página.
  useEffect(() => {
    const url = isFinished ? "/nivelamento?pergunta=fim" : `/nivelamento?pergunta=${index + 1}`;
    window.history.replaceState(null, "", url);
  }, [index, isFinished]);

  /** Depois que a nova pergunta entra, o foco vai para ela (leitor de tela lê o enunciado). */
  function focusHeading() {
    if (answers.length > 0) headingRef.current?.focus({ preventScroll: true });
  }

  // Enter responde de qualquer ponto da conversa (o foco pode estar no título).
  const handleGlobalEnter = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== "Enter" || isFinished || event.defaultPrevented) return;
    const target = event.target;
    const isOwnControl =
      target instanceof HTMLButtonElement ||
      target instanceof HTMLAnchorElement ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement;
    if (isOwnControl) return;
    event.preventDefault();
    submitChoice();
  });

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalEnter);
    return () => window.removeEventListener("keydown", handleGlobalEnter);
  }, []);

  /** Registra a resposta da pergunta atual; um clique repetido durante a transição é ignorado. */
  function answer(letter: string | null) {
    const answeredIndex = index;
    setAnswers((current) =>
      current.some((item) => item.questionId === question.id)
        ? current
        : [...current, { questionId: question.id, letter }],
    );
    setChoice("");
    setHasError(false);
    setIndex((current) => (current === answeredIndex ? current + 1 : current));
  }

  function submitChoice() {
    if (!choice && IS_ENTRY_VALIDATION_ENABLED) {
      setHasError(true);
      return;
    }
    answer(choice || null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitChoice();
  }

  function restart() {
    setAnswers([]);
    setChoice("");
    setIndex(0);
  }

  const score = answers.filter((item) => {
    const asked = questions.find((questionItem) => questionItem.id === item.questionId);
    return asked && item.letter === asked.answer;
  }).length;
  const result = results.find((item) => score >= item.minScore) ?? results[results.length - 1];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <FlowProgress stage="Nivelamento" step={Math.min(index + 1, questions.length)} steps={questions.length} />
          </div>
          {isFinished ? null : (
            <Link
              href="/inicio"
              className="-mt-3 flex min-h-11 shrink-0 items-center text-[13px] text-texto-secundario underline-offset-4 outline-none hover:text-texto hover:underline focus-visible:underline"
            >
              Pular
            </Link>
          )}
        </div>

        {isFinished ? null : <LevelingTranscript questions={questions} answers={answers} />}

        <AnimatePresence mode="wait" initial={false}>
          {isFinished ? (
            <motion.section
              key="resultado"
              aria-labelledby="titulo-resultado"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              onAnimationComplete={focusHeading}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                  <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                  Seu ponto de partida
                </p>
                <h1
                  id="titulo-resultado"
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-[32px] leading-[1.04] font-medium tracking-[-0.04em] text-balance outline-none lg:text-[40px]"
                >
                  {result.title}
                </h1>
                <p className="text-[15px] leading-relaxed text-texto-secundario">{result.description}</p>
              </div>

              <dl className="grid grid-cols-2 border-y border-linha py-5">
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Em sintonia</dt>
                  <dd className="font-display text-[40px] leading-none font-light tabular-nums">
                    {String(score).padStart(2, "0")}
                    <span className="text-[20px] text-texto-secundario"> / {String(questions.length).padStart(2, "0")}</span>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Vale XP?</dt>
                  <dd className="pt-2 text-sm leading-snug text-texto-secundario">Não. Só ajusta por onde a trilha começa.</dd>
                </div>
              </dl>

              <ul aria-label="Por assunto" className="divide-y divide-linha">
                {questions.map((item) => {
                  const given = answers.find((answerItem) => answerItem.questionId === item.id);
                  const isAligned = given?.letter === item.answer;
                  return (
                    <li key={item.id} className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
                      <span>{item.topic}</span>
                      <span
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 font-mono text-[11px] whitespace-nowrap",
                          isAligned ? "text-texto" : "text-texto-secundario",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn("size-2 rounded-[2px]", isAligned ? "bg-acao" : "ring-1 ring-texto-secundario ring-inset")}
                        />
                        {isAligned ? "domina" : "vamos ver na trilha"}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-3">
                <ActionLink href={result.href} className="w-full">
                  {result.ctaLabel}
                </ActionLink>
                <div className="flex items-center justify-between">
                  <Link
                    href="/inicio"
                    className="flex min-h-11 items-center text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    Ir para a Home
                  </Link>
                  <button
                    type="button"
                    onClick={restart}
                    className="flex min-h-11 items-center gap-1.5 text-[13px] text-texto-secundario outline-none hover:text-texto focus-visible:underline"
                  >
                    <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
                    Refazer
                  </button>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.form
              key={question.id}
              noValidate
              onSubmit={handleSubmit}
              aria-labelledby="titulo-pergunta"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
              onAnimationComplete={focusHeading}
              className="flex flex-col gap-7"
            >
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[11px] tracking-[0.04em] text-texto-secundario uppercase">{question.topic}</p>
                <h1
                  id="titulo-pergunta"
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-[28px] leading-[1.08] font-medium tracking-[-0.035em] text-balance outline-none lg:text-[34px]"
                >
                  {question.statement}
                </h1>
              </div>

              <div className="flex flex-col gap-2">
                <ChoiceList
                  name={`${question.id}-resposta`}
                  legend={question.statement}
                  value={choice}
                  onChange={(value) => {
                    setChoice(value);
                    setHasError(false);
                  }}
                  isInvalid={hasError}
                  describedBy={hasError ? "nivelamento-erro" : undefined}
                  choices={question.options.map((option) => ({
                    value: option.letter,
                    marker: option.letter,
                    title: option.text,
                  }))}
                />
                {hasError ? (
                  <p id="nivelamento-erro" role="alert" className="text-[13px] text-destructive">
                    Escolha uma alternativa ou toque em “Ainda não sei”.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <ColorBurstButton type="submit" className={submitButtonClass}>
                  {index === questions.length - 1 ? "Ver meu ponto de partida" : "Responder"}
                </ColorBurstButton>
                <button
                  type="button"
                  onClick={() => answer(null)}
                  className="flex min-h-11 items-center justify-center text-sm font-semibold text-texto-secundario outline-none hover:text-texto focus-visible:underline"
                >
                  Ainda não sei
                </button>
              </div>
              <p aria-hidden className="hidden font-mono text-[11px] text-texto-secundario lg:block">
                Atalho: A–D escolhe · Enter responde
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
