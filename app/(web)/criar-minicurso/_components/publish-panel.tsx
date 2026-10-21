import { Check, Circle } from "lucide-react";

import { SurfaceCard } from "@/components/surface-card";
import type { CourseDraft, PublishCheck } from "@/lib/data/criar-minicurso";
import { cn } from "@/lib/utils";
import { CourseShapes } from "./course-shapes";
import { PublishButton } from "./publish-button";

type PublishPanelProps = {
  course: CourseDraft;
  totalMinutes: number;
  checklist: PublishCheck[];
};

/**
 * Coluna da direita: prévia do cartão como aparece em Cursos da comunidade,
 * checklist de publicação e o botão Publicar.
 */
export function PublishPanel({ course, totalMinutes, checklist }: PublishPanelProps) {
  return (
    <aside aria-label="Prévia e publicação" className="flex flex-col gap-4">
      <SurfaceCard as="section" aria-labelledby="previa-titulo" className="mx-0">
        <h2 id="previa-titulo" className="px-4 pt-4 text-xs font-semibold text-texto-secundario">
          Prévia em Cursos da comunidade
        </h2>
        <div className="mx-4 mt-3 flex justify-center rounded-t-[999px] bg-comunidade/15 pt-4">
          <CourseShapes className="h-24 w-auto" />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <p className="font-display text-lg leading-snug font-bold">{course.title}</p>
          <p className="text-sm leading-snug text-texto-secundario">{course.summary}</p>
          <p className="mt-1 text-xs text-texto-secundario">
            por {course.author} · {course.lessons.length} aulas · {totalMinutes} min · gratuito
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {course.tags.map((tag) => (
              <li key={tag} className="rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-linha">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </SurfaceCard>

      <SurfaceCard as="section" aria-labelledby="publicar-titulo" className="mx-0 flex flex-col gap-3 p-4">
        <h2 id="publicar-titulo" className="font-display text-base font-bold">
          Antes de publicar
        </h2>
        <ul className="flex flex-col gap-2 text-sm">
          {checklist.map((check) => (
            <li key={check.id} className="flex items-start gap-2.5">
              {check.isDone ? (
                <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-acao">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
              ) : (
                <Circle aria-hidden className="mt-px size-5 shrink-0 text-desativado" strokeWidth={1.75} />
              )}
              <span className={cn(!check.isDone && "font-semibold")}>
                {check.label}
                <span className="sr-only">{check.isDone ? " (feito)" : " (pendente)"}</span>
              </span>
            </li>
          ))}
        </ul>
        <PublishButton courseId={course.id} />
      </SurfaceCard>
    </aside>
  );
}
