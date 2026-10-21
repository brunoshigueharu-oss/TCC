import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { ProgressBar } from "@/components/progress-bar";
import { SurfaceCard } from "@/components/surface-card";
import {
  courseTagLabels,
  formatDuration,
  formatLessonsCount,
  getCourseMinutes,
} from "@/lib/data/cursos";
import { CourseCover } from "../_components/course-cover";
import { getCourse } from "../_data-access/get-courses";
import { CourseLessons } from "./_components/course-lessons";

export async function generateMetadata({
  params,
}: PageProps<"/educacao/cursos/[cursoId]">): Promise<Metadata> {
  const { cursoId } = await params;
  const course = await getCourse(cursoId);
  return { title: course ? course.title : "Minicurso" };
}

/** Minicurso (Figma: "Minicurso"): capa, autoria, aulas e botão para o player. */
export default async function CoursePage({ params }: PageProps<"/educacao/cursos/[cursoId]">) {
  const { cursoId } = await params;
  const course = await getCourse(cursoId);
  if (!course) notFound();

  const totalLessons = course.lessons.length;
  const hasStarted = course.completedLessons > 0;
  const isFinished = course.completedLessons >= totalLessons;
  const nextLesson = isFinished ? 1 : course.completedLessons + 1;
  const ctaLabel = isFinished
    ? "Assistir de novo"
    : hasStarted
      ? `Continuar da aula ${nextLesson}`
      : "Começar curso";

  return (
    <>
      <BackBar href="/educacao/cursos" label="Cursos da comunidade" />
      <main className="flex flex-col gap-7 pt-5 pb-8">
        <SurfaceCard as="article" aria-labelledby="titulo-curso">
          <CourseCover cover={course.cover} className="h-[168px]" />
          <div className="flex flex-col gap-3 p-4">
            <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
              {course.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-comunidade/15 px-2.5 py-1 text-xs font-semibold"
                >
                  {courseTagLabels[tag]}
                </li>
              ))}
            </ul>
            <h1 id="titulo-curso" className="font-display text-[22px] leading-tight font-bold">
              {course.title}
            </h1>
            <p className="text-xs text-texto-secundario">
              {formatLessonsCount(totalLessons)} · {formatDuration(getCourseMinutes(course))} · Gratuito
            </p>
            <p className="text-[15px] leading-normal">{course.description}</p>
            {hasStarted ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold">
                  {course.completedLessons} de {totalLessons} aulas assistidas
                </span>
                <ProgressBar
                  value={course.completedLessons}
                  max={totalLessons}
                  tone="comunidade"
                  label="Progresso no minicurso"
                />
              </div>
            ) : null}
          </div>

          <Link
            href={`/comunidade/pessoas/${course.author.username}`}
            className="flex items-center gap-3 border-t border-linha px-4 py-3"
          >
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-comunidade font-display font-bold"
            >
              {course.author.name.charAt(0)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs text-texto-secundario">Criado por</span>
              <span className="text-[15px] font-semibold">{course.author.name}</span>
              <span className="text-xs text-texto-secundario">{course.author.role}</span>
            </span>
            <ChevronRight aria-hidden className="size-5 text-texto-secundario" strokeWidth={2} />
          </Link>
        </SurfaceCard>

        <div className="px-4">
          <ActionLink href={`/educacao/cursos/${course.id}/player?aula=${nextLesson}`}>
            {ctaLabel}
          </ActionLink>
        </div>

        <CourseLessons course={course} />
      </main>
    </>
  );
}
