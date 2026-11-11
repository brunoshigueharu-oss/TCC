"use client";

import { MotionConfig, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { LandingData } from "@/lib/data/landing";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductCardPreview } from "./product-card-preview";

type PromptDemoProps = {
  demo: LandingData["demo"];
};

/** Intervalo entre caracteres digitados (ms). */
const TYPE_INTERVAL_MS = 18;

/** Prompt acumulado até a versão `step` (inclusive). */
function promptUpTo(steps: LandingData["demo"]["steps"], step: number) {
  return steps
    .slice(0, step + 1)
    .map((item) => item.addition)
    .join(" ");
}

/**
 * Demonstração da prática: três versões do mesmo prompt. Ao trocar de versão,
 * o trecho novo é digitado e, quando termina, o card à direita se rearranja
 * (animação de layout). Com menos movimento, tudo aparece de uma vez.
 */
export function PromptDemo({ demo }: PromptDemoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rootRef, { once: true, margin: "0px 0px -25% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [typedCount, setTypedCount] = useState(0);

  const fullPrompt = promptUpTo(demo.steps, step);
  const isTyping = !shouldReduceMotion && typedCount < fullPrompt.length;
  const shownPrompt = isTyping ? fullPrompt.slice(0, typedCount) : fullPrompt;
  // Enquanto digita, o card ainda mostra a versão anterior.
  const previewStep = isTyping ? Math.max(0, step - 1) : step;
  const activeStep = demo.steps[step];

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const timer = window.setInterval(() => {
      setTypedCount((count) => Math.min(count + 1, fullPrompt.length));
    }, TYPE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isInView, shouldReduceMotion, fullPrompt.length]);

  const handleSelect = (nextStep: number) => {
    if (nextStep === step) return;
    // Voltar mostra direto; avançar digita só o trecho novo (pulando o espaço).
    setTypedCount(
      nextStep < step ? promptUpTo(demo.steps, nextStep).length : promptUpTo(demo.steps, nextStep - 1).length + 1,
    );
    setStep(nextStep);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = demo.steps.length - 1;
    const keyToStep: Record<string, number> = {
      ArrowRight: step === last ? 0 : step + 1,
      ArrowLeft: step === 0 ? last : step - 1,
      Home: 0,
      End: last,
    };
    const nextStep = keyToStep[event.key];
    if (nextStep === undefined) return;
    event.preventDefault();
    handleSelect(nextStep);
    rootRef.current?.querySelector<HTMLButtonElement>(`#demo-aba-${demo.steps[nextStep].id}`)?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="grid overflow-hidden rounded-[28px] bg-superficie sm:rounded-[36px] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
      >
        {/* Lado do prompt */}
        <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
          <div role="tablist" aria-label="Versões do prompt" className="flex gap-1 rounded-full bg-fundo p-1 ring-1 ring-linha">
            {demo.steps.map((item, itemIndex) => {
              const isSelected = itemIndex === step;
              return (
                <button
                  key={item.id}
                  id={`demo-aba-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="demo-painel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelect(itemIndex)}
                  onKeyDown={handleTabKeyDown}
                  className={cn(
                    "flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-semibold whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-texto",
                    isSelected ? "bg-texto text-fundo" : "text-texto-secundario hover:bg-superficie hover:text-texto",
                  )}
                >
                  <span className="font-mono text-[11px] font-normal tabular-nums opacity-70">
                    v{itemIndex + 1}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            id="demo-painel"
            role="tabpanel"
            aria-labelledby={`demo-aba-${activeStep.id}`}
            className="flex flex-1 flex-col gap-5"
          >
            <div className="flex flex-col gap-3">
              <p className="flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                Seu prompt
                <span className="font-mono font-normal tracking-normal normal-case tabular-nums">
                  {formatTwoDigits(fullPrompt.length)} caracteres
                </span>
              </p>
              {/* Altura mínima: a caixa não pula enquanto o texto cresce. */}
              <p className="min-h-[9.5rem] rounded-xl bg-fundo p-4 font-mono text-[13px] leading-relaxed ring-1 ring-linha sm:min-h-[8rem]">
                <span className="sr-only">{fullPrompt}</span>
                <span aria-hidden>
                  {shownPrompt}
                  <span
                    className={cn(
                      "ml-px inline-block h-[1.1em] w-[7px] translate-y-[0.2em] bg-pratica",
                      isTyping ? "opacity-100" : "animate-pulse motion-reduce:animate-none",
                    )}
                  />
                </span>
              </p>
            </div>

            <div className="mt-auto flex items-start gap-3 border-t border-linha pt-4">
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-[2px] transition-colors duration-300",
                  step === demo.steps.length - 1 ? "bg-acao" : step === 0 ? "bg-desativado" : "bg-trilha",
                )}
              />
              <p aria-live="polite" className="text-sm leading-relaxed">
                <span className="font-semibold">Parecer: </span>
                {isTyping ? "lendo o prompt…" : activeStep.verdict}
              </p>
            </div>
          </div>
        </div>

        {/* Lado do resultado */}
        <div className="relative flex min-h-[420px] items-center justify-center border-t border-linha bg-fundo px-6 pt-14 pb-10 sm:p-14 lg:border-t-0 lg:border-l">
          <p
            aria-hidden
            className="absolute top-4 left-5 flex items-center gap-2 font-mono text-[11px] text-texto-secundario sm:left-6"
          >
            <span className={cn("size-1.5 rounded-full", isTyping ? "animate-pulse bg-pratica" : "bg-acao")} />
            {isTyping ? "gerando" : "resultado"} · v{previewStep + 1}
          </p>
          <ProductCardPreview product={demo.product} step={previewStep} isDimmed={isTyping} />
        </div>
      </div>
    </MotionConfig>
  );
}
