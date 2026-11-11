import { Check, Minus, Plus } from "lucide-react";

import type { LandingPillarSample } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

const sampleLabelClass = "text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase";

/**
 * Recorte de cada pilar, desenhado como um pedaço do próprio hub (lista de
 * lições, parecer, pergunta, nota mínima). Só leitura, mas fica exposto ao
 * leitor de tela: o conteúdo ajuda a entender o pilar.
 */
export function PillarSample({ sample }: { sample: LandingPillarSample }) {
  return (
    <figure className="flex flex-col gap-4 rounded-xl border border-linha bg-fundo p-5 transition-[border-color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:border-texto/40">
      <figcaption className={sampleLabelClass}>{sample.label}</figcaption>
      <SampleBody sample={sample} />
    </figure>
  );
}

function SampleBody({ sample }: { sample: LandingPillarSample }) {
  switch (sample.kind) {
    case "licoes":
      return (
        <ol className="divide-y divide-linha">
          {sample.lessons.map((lesson) => (
            <li key={lesson.title} className="flex items-center gap-3 py-2.5 text-sm first:pt-0 last:pb-0">
              {lesson.isDone ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-acao text-tinta">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                  <span className="sr-only">Concluída:</span>
                </span>
              ) : (
                <span aria-hidden className="size-5 shrink-0 rounded-full border border-linha" />
              )}
              <span className={cn("min-w-0 flex-1", lesson.isDone ? "text-texto-secundario" : "font-medium")}>
                {lesson.title}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-texto-secundario">{lesson.minutes} min</span>
            </li>
          ))}
        </ol>
      );
    case "parecer":
      return (
        <div className="flex flex-col gap-4">
          <p className="rounded-lg bg-superficie px-3 py-2.5 font-mono text-[12px] leading-relaxed">{sample.prompt}</p>
          <ul className="flex flex-col gap-2">
            {sample.notes.map((note) => {
              const Icon = note.isPositive ? Plus : Minus;
              return (
                <li key={note.text} className="flex items-start gap-2.5 text-sm">
                  <Icon
                    aria-hidden
                    className={cn("mt-0.5 size-4 shrink-0", note.isPositive ? "text-acao" : "text-pratica")}
                    strokeWidth={2.25}
                  />
                  <span className="sr-only">{note.isPositive ? "Acerto:" : "Ajuste:"}</span>
                  {note.text}
                </li>
              );
            })}
          </ul>
        </div>
      );
    case "pergunta":
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-snug font-medium">{sample.question}</p>
          <p className="flex items-center gap-2 text-xs text-texto-secundario">
            <span className="rounded-full border border-linha px-2 py-0.5 font-medium text-texto">#{sample.tag}</span>
            {sample.author}
            <span aria-hidden>·</span>
            <span className="font-mono tabular-nums">{sample.answers} respostas</span>
          </p>
          <p className="border-l-2 border-comunidade pl-3 text-sm leading-relaxed text-texto-secundario">
            {sample.reply}
          </p>
        </div>
      );
    case "nota":
      return (
        <div className="flex flex-col gap-4">
          <p className="flex items-baseline gap-3">
            <span className="font-display text-6xl leading-none font-light tracking-[-0.05em] tabular-nums">
              {sample.value}
            </span>
            <span className="text-sm text-texto-secundario">{sample.caption}</span>
          </p>
          <ul className="flex flex-wrap gap-2">
            {sample.facts.map((fact) => (
              <li key={fact} className="rounded-full border border-linha px-2.5 py-1 text-xs font-medium">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
