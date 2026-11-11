import { Check } from "lucide-react";

import { ProgressBar } from "@/components/progress-bar";
import type { CourseDraft, PublishCheck } from "@/lib/data/criar-minicurso";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PublishButton } from "./publish-button";

type PublishPanelProps = {
  course: CourseDraft;
  totalMinutes: number;
  checklist: PublishCheck[];
};

/**
 * Coluna da direita: prévia do cartão como aparece em Cursos da comunidade
 * (a capa é tipográfica, no azul do pilar Comunidade — o único bloco de cor
 * da tela), checklist com progresso e o botão Publicar.
 */
export function PublishPanel({ course, totalMinutes, checklist }: PublishPanelProps) {
  const doneCount = checklist.filter((check) => check.isDone).length;

  return (
    <aside aria-label="Prévia e publicação" className="flex flex-col gap-8 xl:sticky xl:top-24">
      <section aria-labelledby="previa-titulo" className="flex flex-col gap-3">
        <h2 id="previa-titulo" className="border-b border-linha pb-3 text-xs font-semibold tracking-[0.08em] uppercase">
          Prévia
        </h2>
        <article className="overflow-hidden rounded-xl border border-linha">
          <div className="flex aspect-[16/9] flex-col justify-between bg-comunidade p-4 text-tinta">
            <span className="flex items-center justify-between font-mono text-[11px] uppercase">
              <span>BASE8 / curso</span>
              <span className="tabular-nums">{formatTwoDigits(course.lessons.length)} aulas</span>
            </span>
            <span className="max-w-[14ch] font-display text-[26px] leading-[1] font-medium tracking-[-0.04em]">
              {course.title}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 p-4">
            <p className="text-sm leading-snug text-texto-secundario">{course.summary}</p>
            <p className="font-mono text-[11px] text-texto-secundario">
              {course.author} · {totalMinutes} min · gratuito
            </p>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {course.tags.map((tag) => (
                <li key={tag} className="rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-linha">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section aria-labelledby="publicar-titulo" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between border-b border-linha pb-3">
          <h2 id="publicar-titulo" className="text-xs font-semibold tracking-[0.08em] uppercase">
            Antes de publicar
          </h2>
          <span className="font-mono text-[11px] text-texto-secundario tabular-nums">
            {doneCount}/{checklist.length}
          </span>
        </div>
        <ProgressBar value={doneCount} max={checklist.length} tone="acao" label="Requisitos para publicar" className="h-1" />
        <ul className="flex flex-col gap-3 text-sm">
          {checklist.map((check) => (
            <li key={check.id} className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-px flex size-5 shrink-0 items-center justify-center rounded-full",
                  check.isDone ? "bg-acao text-tinta" : "border border-dashed border-desativado",
                )}
              >
                {check.isDone ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              <span className={cn("leading-snug", check.isDone ? "text-texto-secundario" : "font-medium")}>
                {check.label}
                <span className="sr-only">{check.isDone ? " (feito)" : " (pendente)"}</span>
              </span>
            </li>
          ))}
        </ul>
        <PublishButton courseId={course.id} />
      </section>
    </aside>
  );
}
