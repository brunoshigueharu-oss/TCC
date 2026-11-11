"use client";

import { ArrowLeft, ArrowRight, CornerDownLeft } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LessonComplete } from "./lesson-complete";
import { LessonNotes } from "./lesson-notes";
import { LessonStepView, stepKindLabel } from "./lesson-step-view";
import { LessonTopBar } from "./lesson-top-bar";
import type { LessonPlayerData } from "./lesson-types";
import { emptyAnswer, type QuestionAnswer } from "./step-question";

const EASE = [0.22, 1, 0.36, 1] as const;

type LessonPlayerProps = LessonPlayerData & {
  /** Etapa inicial (0-based), vinda de `?etapa=`. */
  initialStep: number;
  /** `?etapa=fim`: abre direto na tela de conclusão. */
  isInitiallyComplete?: boolean;
  /** Dúvidas da aula, renderizadas no servidor e encaixadas na lateral. */
  sideContent?: React.ReactNode;
};

/** Teclas só valem quando o foco não está num campo de texto ou controle deslizante. */
function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && target.type !== "checkbox" && target.type !== "radio";
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest("button, a, [role='switch'], [role='tab']") !== null;
}

/**
 * Player da lição: etapas com transição, perguntas com retorno, modo foco e
 * navegação por teclado (← →, Enter, 1–4 nas perguntas, F para o modo foco,
 * Esc para sair dele). A etapa atual fica na URL (`?etapa=N`).
 */
export function LessonPlayer({
  lesson,
  moduleId,
  moduleNumber,
  moduleLessonsCount,
  nextLesson,
  glossary,
  scenario,
  initialStep,
  isInitiallyComplete = false,
  sideContent,
}: LessonPlayerProps) {
  const total = lesson.steps.length;
  const [stepIndex, setStepIndex] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [furthest, setFurthest] = useState(isInitiallyComplete ? lesson.steps.length - 1 : initialStep);
  const [isComplete, setIsComplete] = useState(isInitiallyComplete);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswer>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  const step = lesson.steps[stepIndex];
  const answer = answers[stepIndex] ?? emptyAnswer;
  const isQuestion = step.kind === "pergunta" && step.question !== undefined;
  const isAnsweredRight = isQuestion && answer.isChecked && answer.selected === step.question?.correctIndex;
  const isLastStep = stepIndex === total - 1;

  // Mantém a URL em dia sem recarregar (a página do servidor lê `?etapa=`).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (isComplete) url.searchParams.set("etapa", "fim");
    else url.searchParams.set("etapa", String(stepIndex + 1));
    window.history.replaceState(null, "", url);
  }, [stepIndex, isComplete]);

  // No modo foco a página por trás não rola.
  useEffect(() => {
    if (!isFocusMode) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFocusMode]);

  const scrollToTop = useCallback(() => {
    if (isFocusMode) rootRef.current?.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0 });
  }, [isFocusMode]);

  const goTo = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(total - 1, index));
      setDirection(target >= stepIndex ? 1 : -1);
      setIsComplete(false);
      setStepIndex(target);
      setFurthest((value) => Math.max(value, target));
      scrollToTop();
    },
    [stepIndex, total, scrollToTop],
  );

  const handleSelectOption = useCallback(
    (index: number) => {
      setAnswers((current) => {
        const previous = current[stepIndex] ?? emptyAnswer;
        if (previous.isChecked) return current;
        return { ...current, [stepIndex]: { ...previous, selected: index } };
      });
    },
    [stepIndex],
  );

  /** Ação principal da etapa: verificar, tentar de novo, continuar ou concluir. */
  const handlePrimary = useCallback(() => {
    if (isQuestion && !answer.isChecked) {
      if (answer.selected === null) return;
      setAnswers((current) => ({
        ...current,
        [stepIndex]: { ...answer, isChecked: true, attempts: answer.attempts + 1 },
      }));
      return;
    }
    if (isQuestion && !isAnsweredRight) {
      setAnswers((current) => ({ ...current, [stepIndex]: { ...answer, selected: null, isChecked: false } }));
      return;
    }
    if (isLastStep) {
      setDirection(1);
      setIsComplete(true);
      setFurthest(total - 1);
      scrollToTop();
      return;
    }
    goTo(stepIndex + 1);
  }, [answer, goTo, isAnsweredRight, isLastStep, isQuestion, scrollToTop, stepIndex, total]);

  const canGoForward = !isQuestion || isAnsweredRight;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
        return;
      }
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        setIsFocusMode((value) => !value);
        return;
      }
      if (isComplete) return;

      if (event.key === "ArrowRight" && canGoForward) {
        event.preventDefault();
        handlePrimary();
      } else if (event.key === "ArrowLeft" && stepIndex > 0) {
        event.preventDefault();
        goTo(stepIndex - 1);
      } else if (event.key === "Enter" && !isInteractiveTarget(event.target)) {
        event.preventDefault();
        handlePrimary();
      } else if (isQuestion && step.question) {
        const letterIndex = ["a", "b", "c", "d"].indexOf(event.key.toLowerCase());
        const numberIndex = Number(event.key) - 1;
        const optionIndex = letterIndex >= 0 ? letterIndex : numberIndex;
        if (Number.isInteger(optionIndex) && optionIndex >= 0 && optionIndex < step.question.options.length) {
          event.preventDefault();
          handleSelectOption(optionIndex);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoForward, goTo, handlePrimary, handleSelectOption, isComplete, isFocusMode, isQuestion, step, stepIndex]);

  const primaryLabel = isQuestion
    ? !answer.isChecked
      ? "Verificar"
      : isAnsweredRight
        ? isLastStep
          ? "Concluir lição"
          : "Continuar"
        : "Tentar de novo"
    : isLastStep
      ? "Concluir lição"
      : "Continuar";

  const questionSteps = lesson.steps
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.kind === "pergunta");
  const firstTry = questionSteps.filter(({ index }) => answers[index]?.attempts === 1).length;

  const backLabel = `Módulo ${formatTwoDigits(moduleNumber)}`;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        data-focus={isFocusMode ? "" : undefined}
        className={cn(
          "flex flex-col px-4 lg:px-0",
          isFocusMode && "fixed inset-0 z-50 overflow-y-auto bg-fundo px-4 lg:px-10",
        )}
      >
        <div className={cn("mx-auto flex w-full flex-col", isFocusMode && "max-w-[1120px]")}>
          <LessonTopBar
            backLabel={backLabel}
            lessonTitle={`Lição ${formatTwoDigits(lesson.number)} de ${formatTwoDigits(moduleLessonsCount)} · ${lesson.title}`}
            current={stepIndex}
            total={total}
            isComplete={isComplete}
            isFocusMode={isFocusMode}
            onToggleFocus={() => setIsFocusMode((value) => !value)}
            onJump={goTo}
            furthest={furthest}
          />

          <div
            className={cn(
              "grid gap-x-12 gap-y-10 pt-6 pb-10 lg:pt-10",
              !isFocusMode && "lg:grid-cols-[minmax(0,1fr)_260px]",
            )}
          >
            <main className={cn("min-w-0", isFocusMode && "mx-auto w-full", isFocusMode && !isComplete && "lg:pt-6")}>
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {isComplete ? (
                  <motion.div
                    key="fim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LessonComplete
                      lessonNumber={lesson.number}
                      lessonTitle={lesson.title}
                      xp={lesson.xpReward}
                      stepsCount={total}
                      questions={{ total: questionSteps.length, firstTry }}
                      minutes={lesson.minutes}
                      moduleNumber={moduleNumber}
                      moduleId={moduleId}
                      nextLesson={nextLesson}
                      onReview={() => goTo(0)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={stepIndex}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 24, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: direction * -16, filter: "blur(2px)" }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className={cn(isFocusMode && "mx-auto max-w-[1120px]")}
                  >
                    <LessonStepView
                      step={step}
                      index={stepIndex}
                      total={total}
                      glossary={glossary}
                      scenario={scenario}
                      answer={answer}
                      onSelectOption={handleSelectOption}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isComplete ? (
                <div
                  className={cn(
                    "mt-10 flex items-center gap-3 border-t border-linha pt-5",
                    step.kind === "playground" || step.kind === "comparacao" ? "" : "max-w-[640px]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => goTo(stepIndex - 1)}
                    disabled={stepIndex === 0}
                    aria-label="Etapa anterior"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full outline-none ring-1 ring-linha transition-colors hover:bg-superficie hover:ring-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ArrowLeft aria-hidden className="size-4" strokeWidth={2} />
                  </button>
                  <p className="hidden flex-1 items-center gap-2 font-mono text-[11px] tracking-wide text-texto-secundario uppercase md:flex">
                    <kbd className="rounded border border-linha px-1.5 py-0.5">←</kbd>
                    <kbd className="rounded border border-linha px-1.5 py-0.5">→</kbd>
                    navegar
                    <span aria-hidden className="mx-1 text-linha">
                      ·
                    </span>
                    <kbd className="rounded border border-linha px-1.5 py-0.5">F</kbd>
                    foco
                  </p>
                  <span className="flex-1 md:hidden" />
                  <ColorBurstButton
                    type="button"
                    onClick={handlePrimary}
                    disabled={isQuestion && !answer.isChecked && answer.selected === null}
                    className="min-w-40"
                  >
                    {primaryLabel}
                    {isQuestion && !answer.isChecked ? (
                      <CornerDownLeft aria-hidden />
                    ) : canGoForward ? (
                      <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    ) : null}
                  </ColorBurstButton>
                </div>
              ) : null}
            </main>

            {!isFocusMode ? (
              <aside className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
                <nav aria-labelledby="roteiro" className="hidden flex-col lg:flex">
                  <h2
                    id="roteiro"
                    className="flex min-h-11 items-center gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase"
                  >
                    <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                    Roteiro
                  </h2>
                  <ol>
                    {lesson.steps.map((item, index) => {
                      const isCurrent = !isComplete && index === stepIndex;
                      const canJump = index <= furthest;
                      return (
                        <li key={index}>
                          <button
                            type="button"
                            disabled={!canJump}
                            onClick={() => goTo(index)}
                            aria-current={isCurrent ? "step" : undefined}
                            className={cn(
                              "flex w-full items-baseline gap-3 border-b border-linha py-2.5 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto",
                              isCurrent ? "text-texto" : canJump ? "text-texto-secundario hover:text-texto" : "text-desativado",
                            )}
                          >
                            <span className="font-mono text-[11px] tabular-nums">{formatTwoDigits(index + 1)}</span>
                            <span className={cn("flex-1", isCurrent && "font-semibold")}>
                              {item.title ?? stepKindLabel[item.kind]}
                            </span>
                            {isCurrent ? (
                              <motion.span
                                layoutId="roteiro-atual"
                                aria-hidden
                                className="size-1.5 self-center rounded-full bg-texto"
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
                <LessonNotes lessonId={lesson.id} />
                {sideContent}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
