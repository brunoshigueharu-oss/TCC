import { Check, Play } from "lucide-react";
import Link from "next/link";

import type { Course } from "@/lib/data/cursos";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type CourseLessonsProps = {
  course: Course;
};

/** Sumário do minicurso: aulas numeradas, resumo e duração; abre o player. */
export function CourseLessons({ course }: CourseLessonsProps) {
  const nextNumber = course.completedLessons + 1;

  return (
    <section aria-labelledby="aulas" className="flex flex-col">
      <h2
        id="aulas"
        className="flex min-h-11 items-center justify-between gap-3 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
          Sumário
        </span>
        <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
          {formatTwoDigits(course.completedLessons)}/{formatTwoDigits(course.lessons.length)} assistidas
        </span>
      </h2>
      <ol>
        {course.lessons.map((lesson) => {
          const isWatched = lesson.number <= course.completedLessons;
          const isNext = lesson.number === nextNumber;

          return (
            <li key={lesson.number}>
              <Link
                href={`/educacao/cursos/${course.id}/player?aula=${lesson.number}`}
                className="group flex items-start gap-4 border-b border-linha py-4 outline-none transition-[padding,background-color] duration-200 hover:bg-superficie hover:px-3 focus-visible:ring-2 focus-visible:ring-texto"
              >
                <span
                  className={cn(
                    "w-7 shrink-0 pt-0.5 font-mono text-[12px] tabular-nums",
                    isWatched ? "text-texto-secundario" : "text-texto",
                  )}
                >
                  {formatTwoDigits(lesson.number)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    className={cn(
                      "text-[15px] leading-snug font-medium lg:text-base",
                      isWatched && "text-texto-secundario",
                    )}
                  >
                    {lesson.title}
                  </span>
                  <span className="text-sm leading-relaxed text-texto-secundario">{lesson.summary}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 pt-0.5 font-mono text-[11px] text-texto-secundario uppercase tabular-nums">
                  {lesson.minutes} min
                  {isWatched ? (
                    <Check aria-label="Assistida" className="size-3.5" strokeWidth={2} />
                  ) : isNext ? (
                    <Play aria-label="Próxima" className="size-3.5 fill-current text-texto" strokeWidth={2} />
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
