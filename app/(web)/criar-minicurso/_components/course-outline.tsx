import { Plus } from "lucide-react";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { isLessonReady, type CourseDraft } from "@/lib/data/criar-minicurso";
import { cn } from "@/lib/utils";
import { NEW_LESSON_PARAM } from "../_data-access/get-course-draft";

type CourseOutlineProps = {
  course: CourseDraft;
  totalMinutes: number;
  /** Número da aula aberta no editor. */
  activeNumber: number;
  isNewLesson: boolean;
};

/** Coluna da esquerda: estrutura do curso. Cada aula abre no editor (`?aula=N`). */
export function CourseOutline({ course, totalMinutes, activeNumber, isNewLesson }: CourseOutlineProps) {
  return (
    <SurfaceCard as="section" aria-labelledby="estrutura-titulo" className="mx-0 flex flex-col gap-3 self-start p-4">
      <div>
        <h2 id="estrutura-titulo" className="font-display text-base font-bold">
          Estrutura do curso
        </h2>
        <p className="text-xs text-texto-secundario">
          {course.lessons.length} aulas · {totalMinutes} min
        </p>
      </div>

      <ol className="flex flex-col gap-1">
        {course.lessons.map((lesson, index) => {
          const number = index + 1;
          const isActive = !isNewLesson && number === activeNumber;
          const isReady = isLessonReady(lesson);

          return (
            <li key={lesson.id}>
              <Link
                href={`/criar-minicurso?aula=${number}`}
                scroll={false}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-superficie",
                  isActive && "bg-superficie ring-1 ring-texto",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isReady ? "bg-comunidade/15 ring-1 ring-comunidade" : "ring-1 ring-linha",
                  )}
                >
                  {number}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={cn("text-sm leading-snug", isActive && "font-semibold")}>
                    {lesson.title}
                  </span>
                  <span className="text-xs text-texto-secundario">
                    {lesson.minutes} min{isActive ? " · editando" : ""}
                    {isReady ? "" : " · sem conteúdo"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href={`/criar-minicurso?aula=${NEW_LESSON_PARAM}`}
        scroll={false}
        aria-current={isNewLesson ? "step" : undefined}
        className={cn(
          "flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-linha text-sm font-semibold",
          isNewLesson && "border-texto bg-superficie",
        )}
      >
        <Plus aria-hidden className="size-4" strokeWidth={2.5} />
        Adicionar aula
      </Link>
    </SurfaceCard>
  );
}
