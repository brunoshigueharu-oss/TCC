"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useIndexedRefs } from "@/hooks/use-indexed-refs";
import { usePaperBreeze } from "@/hooks/use-paper-breeze";
import type { LandingData } from "@/lib/data/landing";
import { CrumpleCallout } from "./crumple-callout";
import { crumpleRowClass, PinnedNote } from "./pinned-note";

type ProblemNotesProps = {
  problem: Pick<LandingData["problem"], "points" | "hint" | "resolutionLabel" | "resetLabel">;
};

/**
 * Post-its do problema: além de balançar com o vento, cada um pode ser
 * amassado. O papel vira bolinha, cai, e no lugar dele aparece como o hub
 * responde àquele problema (a sequência é CSS, em `PinnedNote`). Ao lado do
 * primeiro papel fica a dica com seta; depois do primeiro papel amassado, ela
 * some e, acima da fileira, aparece o botão que repõe todos.
 *
 * Foco: o botão de amassar some com o papel, então o foco vai para a resposta
 * que aparece no lugar; o de repor some depois do clique, então o foco volta
 * para o primeiro post-it.
 */
export function ProblemNotes({ problem }: ProblemNotesProps) {
  const { containerRef, noteRef, handlers } = usePaperBreeze<HTMLOListElement>();
  const { elementsRef: resolutionsRef, refFor: resolutionRef } = useIndexedRefs<HTMLDivElement>();
  const [crumpled, setCrumpled] = useState<boolean[]>(() => problem.points.map(() => false));
  /** Quem recebe o foco depois do próximo render: a resposta de um papel ou, depois de repor, o primeiro papel. */
  const focusTargetRef = useRef<number | "first-note" | null>(null);
  const hasCrumpled = crumpled.some(Boolean);

  const handleCrumple = (index: number) => {
    focusTargetRef.current = index;
    setCrumpled((current) => current.map((isCrumpled, position) => isCrumpled || position === index));
  };

  const handleReset = () => {
    focusTargetRef.current = "first-note";
    setCrumpled(problem.points.map(() => false));
  };

  // Depois do render, o alvo já está na tela (a resposta deixou de ser `aria-hidden`; o botão voltou).
  useEffect(() => {
    const target = focusTargetRef.current;
    if (target === null) return;
    focusTargetRef.current = null;
    const element =
      target === "first-note"
        ? containerRef.current?.querySelector<HTMLButtonElement>("button")
        : resolutionsRef.current[target];
    element?.focus({ preventScroll: true });
  }, [containerRef, crumpled, resolutionsRef]);

  return (
    <>
      <div className="mt-6 mb-14 flex min-h-11 items-center justify-center 2xl:mb-10">
        {hasCrumpled ? (
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-11 items-center gap-2 rounded-full px-4 text-sm text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
          >
            <RotateCcw aria-hidden className="size-3.5" strokeWidth={2} />
            {problem.resetLabel}
          </button>
        ) : null}
      </div>

      <ol ref={containerRef} {...handlers} className={crumpleRowClass}>
        {problem.points.map((point, index) => (
          <PinnedNote
            key={point.title}
            note={point}
            index={index}
            paperRef={noteRef(index)}
            crumple={{
              isCrumpled: crumpled[index],
              label: problem.resolutionLabel,
              resolution: point.resolution,
              onCrumple: () => handleCrumple(index),
            }}
            resolutionRef={resolutionRef(index)}
            callout={index === 0 ? <CrumpleCallout hint={problem.hint} isVisible={!hasCrumpled} /> : undefined}
          />
        ))}
      </ol>
    </>
  );
}
