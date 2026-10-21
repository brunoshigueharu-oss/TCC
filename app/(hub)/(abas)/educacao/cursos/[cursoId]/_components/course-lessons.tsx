import { Check, ListVideo } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { Course } from "@/lib/data/cursos";
import { cn } from "@/lib/utils";

type CourseLessonsProps = {
  course: Course;
};

/** Lista de aulas do minicurso; cada uma abre o player na aula certa. */
export function CourseLessons({ course }: CourseLessonsProps) {
  return (
    <section aria-labelledby="aulas" className="flex flex-col gap-2">
      <SectionHeading id="aulas" title="Aulas" icon={ListVideo} tone="comunidade" />
      <SurfaceCard>
        <ol className="divide-y divide-linha">
          {course.lessons.map((lesson) => {
            const isWatched = lesson.number <= course.completedLessons;

            return (
              <li key={lesson.number}>
                <Link
                  href={`/educacao/cursos/${course.id}/player?aula=${lesson.number}`}
                  className="flex min-h-14 items-center gap-3 px-4 py-3"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isWatched ? "bg-acao text-texto" : "bg-superficie text-texto",
                    )}
                  >
                    {isWatched ? (
                      <Check aria-label="Assistida" className="size-4" strokeWidth={2.5} />
                    ) : (
                      lesson.number
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] leading-snug">{lesson.title}</span>
                  <span className="shrink-0 text-xs text-texto-secundario">{lesson.minutes} min</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </SurfaceCard>
    </section>
  );
}
