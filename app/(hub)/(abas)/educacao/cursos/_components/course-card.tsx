import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import { formatDuration, formatLessonsCount, getCourseMinutes, type Course } from "@/lib/data/cursos";
import { CourseCover } from "./course-cover";

type CourseCardProps = {
  course: Course;
};

/** Linha de minicurso na lista: capa à esquerda, título, autoria e duração. */
export function CourseCard({ course }: CourseCardProps) {
  const hasStarted = course.completedLessons > 0;

  return (
    <Link href={`/educacao/cursos/${course.id}`} className="flex gap-4 p-4">
      <CourseCover cover={course.cover} className="size-[88px] shrink-0 rounded-xl" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-display text-lg leading-snug font-bold">{course.title}</span>
        <span className="text-sm text-texto-secundario">por {course.author.name}</span>
        <span className="text-xs text-texto-secundario">
          {formatLessonsCount(course.lessons.length)} · {formatDuration(getCourseMinutes(course))} · Gratuito
        </span>
        {hasStarted ? (
          <span className="flex flex-col gap-1 pt-1">
            <span className="text-xs font-semibold">
              {course.completedLessons} de {course.lessons.length} aulas assistidas
            </span>
            <ProgressBar
              value={course.completedLessons}
              max={course.lessons.length}
              tone="comunidade"
              label={`Progresso em ${course.title}`}
            />
          </span>
        ) : null}
      </span>
    </Link>
  );
}
