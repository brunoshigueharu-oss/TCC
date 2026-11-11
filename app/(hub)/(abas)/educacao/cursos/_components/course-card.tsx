import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import { courseTagLabels, formatDuration, formatLessonsCount, getCourseMinutes, type Course } from "@/lib/data/cursos";
import { formatTwoDigits } from "@/lib/format";
import { CourseCover } from "./course-cover";

type CourseRowProps = {
  course: Course;
  number: number;
};

/** Minicurso em linha: número, título, autoria e dados; capa pequena à direita. */
export function CourseRow({ course, number }: CourseRowProps) {
  const hasStarted = course.completedLessons > 0;

  return (
    <Link
      href={`/educacao/cursos/${course.id}`}
      className="group flex items-start gap-4 border-b border-linha py-5 outline-none transition-[padding,background-color] duration-200 hover:bg-superficie lg:hover:px-3 focus-visible:ring-2 focus-visible:ring-texto"
    >
      <span className="w-7 shrink-0 pt-1 font-mono text-[12px] text-texto-secundario tabular-nums">
        {formatTwoDigits(number)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-display text-xl leading-tight font-medium tracking-[-0.025em] lg:text-[22px]">
          {course.title}
        </span>
        <span className="text-sm text-texto-secundario">
          {course.author.name} · {course.author.role}
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
          <span>{formatLessonsCount(course.lessons.length)}</span>
          <span>{formatDuration(getCourseMinutes(course))}</span>
          <span>{course.tags.map((tag) => courseTagLabels[tag]).join(" / ")}</span>
          {hasStarted ? (
            <span className="text-texto">
              {course.completedLessons}/{course.lessons.length} assistidas
            </span>
          ) : null}
        </span>
      </span>
      <CourseCover pattern={course.cover} number={number} className="hidden h-20 w-28 shrink-0 rounded-lg sm:block" />
      <ArrowRight
        aria-hidden
        className="mt-1 size-4 shrink-0 text-texto-secundario transition-transform duration-200 group-hover:translate-x-1 group-hover:text-texto"
        strokeWidth={2}
      />
    </Link>
  );
}

type FeaturedCourseProps = {
  course: Course;
  number: number;
};

/** Destaque do topo: o minicurso que a pessoa está fazendo, com capa grande. */
export function FeaturedCourse({ course, number }: FeaturedCourseProps) {
  const progress = course.completedLessons / course.lessons.length;

  return (
    <Link
      href={`/educacao/cursos/${course.id}`}
      className="group grid overflow-hidden rounded-xl border border-linha outline-none transition-colors hover:border-texto focus-visible:ring-2 focus-visible:ring-texto sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <CourseCover pattern={course.cover} number={number} className="h-48 border-0 sm:h-full sm:min-h-64" />
      <span className="flex flex-col gap-3 border-t border-linha p-5 sm:border-t-0 sm:border-l lg:p-7">
        <span className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
          <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
          Continuar assistindo
        </span>
        <span className="font-display text-[28px] leading-[1.02] font-medium tracking-[-0.035em] text-balance lg:text-[34px]">
          {course.title}
        </span>
        <span className="text-[15px] leading-relaxed text-texto-secundario">{course.description}</span>
        <span className="mt-auto flex flex-col gap-2 pt-3">
          <span className="flex items-baseline justify-between font-mono text-[11px] tracking-wide uppercase tabular-nums">
            <span>Aula {formatTwoDigits(course.completedLessons + 1)} de {formatTwoDigits(course.lessons.length)}</span>
            <span className="text-texto-secundario">{Math.round(progress * 100)}%</span>
          </span>
          <ProgressBar
            value={course.completedLessons}
            max={course.lessons.length}
            tone="comunidade"
            label={`Progresso em ${course.title}`}
            className="h-1"
          />
          <span className="flex items-center gap-2 pt-2 text-sm font-semibold">
            Retomar curso
            <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </span>
      </span>
    </Link>
  );
}
