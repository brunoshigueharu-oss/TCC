import { Plus } from "lucide-react";
import Link from "next/link";

import { isLessonReady, type CourseDraft } from "@/lib/data/criar-minicurso";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NEW_LESSON_PARAM } from "../_data-access/get-course-draft";

type CourseOutlineProps = {
  course: CourseDraft;
  totalMinutes: number;
  /** Número da aula aberta no editor. */
  activeNumber: number;
  isNewLesson: boolean;
};

/**
 * Coluna da esquerda: estrutura do curso em linhas numeradas. Cada aula abre
 * no editor (`?aula=N`); a aberta ganha régua à esquerda e fundo suave. A
 * bolinha diz se a aula já tem conteúdo.
 */
export function CourseOutline({ course, totalMinutes, activeNumber, isNewLesson }: CourseOutlineProps) {
  const readyCount = course.lessons.filter(isLessonReady).length;

  return (
    <nav aria-labelledby="estrutura-titulo" className="flex flex-col gap-3 py-6 lg:sticky lg:top-16 lg:self-start lg:py-8 lg:pr-6">
      <div className="flex items-baseline justify-between gap-3 border-b border-linha pb-3">
        <h2 id="estrutura-titulo" className="text-xs font-semibold tracking-[0.08em] uppercase">
          Estrutura
        </h2>
        <span className="font-mono text-[11px] text-texto-secundario tabular-nums">
          {readyCount}/{course.lessons.length} prontas · {totalMinutes} min
        </span>
      </div>

      <ol className="flex flex-col">
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
                  "group relative flex min-h-14 items-start gap-3 rounded-lg px-3 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto",
                  isActive ? "bg-superficie" : "hover:bg-superficie/60",
                )}
              >
                {isActive ? (
                  <span aria-hidden className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-full bg-texto" />
                ) : null}
                <span className="pt-0.5 font-mono text-[11px] text-texto-secundario tabular-nums">
                  {formatTwoDigits(number)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={cn("text-sm leading-snug", isActive ? "font-semibold" : "font-medium")}>
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-texto-secundario">
                    <span
                      aria-hidden
                      className={cn("size-1.5 rounded-full", isReady ? "bg-acao" : "border border-desativado")}
                    />
                    {isReady ? "Com conteúdo" : "Sem conteúdo"} · {lesson.minutes} min
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
          "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-texto-secundario outline-none transition-colors hover:bg-superficie/60 hover:text-texto focus-visible:ring-2 focus-visible:ring-texto",
          isNewLesson && "bg-superficie text-texto",
        )}
      >
        <span className="font-mono text-[11px] tabular-nums">{formatTwoDigits(course.lessons.length + 1)}</span>
        <Plus aria-hidden className="size-4" strokeWidth={2} />
        Adicionar aula
      </Link>
    </nav>
  );
}
