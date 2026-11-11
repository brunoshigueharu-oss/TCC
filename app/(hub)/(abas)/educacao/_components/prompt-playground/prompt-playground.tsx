"use client";

import { RotateCcw } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
  buildOutput,
  buildPromptText,
  createInitialPromptState,
  getParam,
  type FragmentId,
  type ParamId,
  type PlaygroundScenario,
  type PromptState,
} from "@/lib/data/playground";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { GeneratedCode } from "./generated-code";
import { GeneratedPreview } from "./generated-preview";
import { PromptEditor } from "./prompt-editor";

/** Tempo da "geração" simulada entre mudar o prompt e ver o resultado. */
const GENERATION_MS = 480;
const EASE = [0.22, 1, 0.36, 1] as const;

type ResultView = "interface" | "codigo";

const resultViews: { id: ResultView; label: string }[] = [
  { id: "interface", label: "Interface" },
  { id: "codigo", label: "Código" },
];

type PromptPlaygroundProps = {
  scenario: PlaygroundScenario;
  className?: string;
};

/**
 * Playground de prompt: à esquerda o prompt em trechos; à direita o resultado
 * simulado, que reage a cada trecho ligado e a cada valor trocado. Não chama
 * nenhuma IA — o resultado é determinístico (ver `lib/data/playground.ts`).
 */
export function PromptPlayground({ scenario, className }: PromptPlaygroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [prompt, setPrompt] = useState<PromptState>(() => createInitialPromptState(scenario));
  // O resultado "chega" um instante depois do prompt, como numa geração.
  const [result, setResult] = useState<PromptState>(prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<ResultView>("interface");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function applyPrompt(next: PromptState) {
    setPrompt(next);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    if (shouldReduceMotion) {
      setResult(next);
      return;
    }
    setIsGenerating(true);
    timerRef.current = window.setTimeout(() => {
      setResult(next);
      setIsGenerating(false);
    }, GENERATION_MS);
  }

  function handleToggleFragment(id: FragmentId) {
    const isEnabled = prompt.enabled.includes(id);
    applyPrompt({
      ...prompt,
      enabled: isEnabled ? prompt.enabled.filter((item) => item !== id) : [...prompt.enabled, id],
    });
  }

  function handleCycleParam(id: ParamId) {
    const { options } = getParam(scenario, id);
    applyPrompt({ ...prompt, values: { ...prompt.values, [id]: (prompt.values[id] + 1) % options.length } });
  }

  const total = scenario.fragments.length;
  const specified = prompt.enabled.length;
  const guesses = scenario.fragments.filter((fragment) => !result.enabled.includes(fragment.id));

  return (
    <MotionConfig reducedMotion="user">
      <section aria-label="Playground de prompt" className={cn("@container", className)}>
        <div className="grid gap-x-10 gap-y-8 @3xl:grid-cols-2">
          {/* Prompt */}
          <div className="flex min-w-0 flex-col">
            <header className="flex min-h-11 items-center justify-between gap-3 border-b border-texto">
              <h3 className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
                <span aria-hidden className="size-2 rounded-[2px] bg-pratica" />
                Seu prompt
              </h3>
              <div className="flex items-center gap-1">
                <CopyButton text={buildPromptText(scenario, prompt)} />
                <button
                  type="button"
                  onClick={() => applyPrompt(createInitialPromptState(scenario))}
                  aria-label="Recomeçar o prompt"
                  className="flex size-8 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-[0.95]"
                >
                  <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
                </button>
              </div>
            </header>

            <PromptEditor
              scenario={scenario}
              state={prompt}
              onToggleFragment={handleToggleFragment}
              onCycleParam={handleCycleParam}
            />

            {/* Medidor: quanto do resultado foi decidido por quem escreveu. */}
            <div className="flex items-center gap-4 pt-4">
              <p className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
                <span className="text-texto">{formatTwoDigits(specified)}</span> / {formatTwoDigits(total)} especificado
              </p>
              <div aria-hidden className="flex flex-1 gap-1">
                {scenario.fragments.map((fragment) => (
                  <span
                    key={fragment.id}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300",
                      prompt.enabled.includes(fragment.id) ? "bg-texto" : "bg-superficie-forte",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="flex min-w-0 flex-col gap-4">
            <header className="flex min-h-11 items-center justify-between gap-3 border-b border-texto">
              <h3 className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
                <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
                Resultado simulado
              </h3>
              <div role="tablist" aria-label="Ver resultado como" className="flex items-center">
                {resultViews.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={view === item.id}
                    onClick={() => setView(item.id)}
                    className={cn(
                      "relative flex h-11 items-center px-2.5 font-mono text-[11px] tracking-wide uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto",
                      view === item.id ? "text-texto" : "text-texto-secundario hover:text-texto",
                    )}
                  >
                    {item.label}
                    {view === item.id ? (
                      <motion.span
                        layoutId={`resultado-aba-${scenario.id}`}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="absolute inset-x-2.5 -bottom-px h-0.5 bg-texto"
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            </header>

            <div role="tabpanel" className="relative">
              {/* Linha de "geração": corre no topo enquanto o resultado não chega. */}
              <AnimatePresence>
                {isGenerating ? (
                  <motion.span
                    key="gerando"
                    aria-hidden
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ scaleX: { duration: GENERATION_MS / 1000, ease: "easeOut" }, opacity: { duration: 0.2 } }}
                    className="absolute inset-x-3 top-0 z-10 h-0.5 origin-left bg-acao"
                  />
                ) : null}
              </AnimatePresence>

              {view === "interface" ? (
                <div
                  className={cn(
                    "flex min-h-[340px] items-center justify-center rounded-xl border border-linha bg-superficie p-5 transition-opacity duration-200 @md:p-8",
                    isGenerating ? "opacity-60" : "opacity-100",
                  )}
                >
                  <GeneratedPreview scenario={scenario} state={result} />
                </div>
              ) : (
                <div className={cn("transition-opacity duration-200", isGenerating ? "opacity-60" : "opacity-100")}>
                  <GeneratedCode lines={buildOutput(scenario, result)} />
                </div>
              )}
              <p aria-live="polite" className="sr-only">
                {isGenerating ? "Gerando resultado" : `Resultado atualizado. ${guesses.length} decisões ficaram com a IA.`}
              </p>
            </div>

            {/* O que a IA precisou adivinhar. */}
            <div className="flex flex-col">
              <p className="flex items-baseline justify-between gap-3 pb-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                Ficou por conta da IA
                <span className="font-mono text-[11px] font-normal tabular-nums">
                  {formatTwoDigits(guesses.length)} / {formatTwoDigits(total)}
                </span>
              </p>
              <ul className="border-t border-linha">
                <AnimatePresence initial={false}>
                  {guesses.map((fragment) => (
                    <motion.li
                      key={fragment.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden border-b border-linha"
                    >
                      <span className="flex gap-3 py-2.5 text-sm leading-snug">
                        <span aria-hidden className="font-mono text-texto-secundario">
                          ?
                        </span>
                        <span>
                          <span className="font-semibold">{fragment.label}:</span>{" "}
                          <span className="text-texto-secundario">a IA escolheu {fragment.guess}.</span>
                        </span>
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <AnimatePresence initial={false}>
                {guesses.length === 0 ? (
                  <motion.p
                    key="completo"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="pt-3 text-sm leading-relaxed"
                  >
                    Nada ficou por conta da IA. Cada decisão do card agora é sua, e o resultado dá para conferir
                    item por item.
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
