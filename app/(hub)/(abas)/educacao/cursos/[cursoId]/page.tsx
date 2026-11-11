import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { ProgressBar } from "@/components/progress-bar";
import { courseTagLabels, formatDuration, formatLessonsCount, getCourseMinutes } from "@/lib/data/cursos";
import { CourseCover } from "../_components/course-cover";
import { getCourse, getCourseNumber } from "../_data-access/get-courses";
import { CourseLessons } from "./_components/course-lessons";

export async function generateMetadata({ params }: PageProps<"/educacao/cursos/[cursoId]">): Promise<Metadata> {
  const { cursoId } = await params;
  const course = await getCourse(cursoId);
  return { title: course ? course.title : "Minicurso" };
}

/** Minicurso (Figma: "Minicurso"): capa, autoria, aulas e botão para o player. */
export default async function CoursePage({ params }: PageProps<"/educacao/cursos/[cursoId]">) {
  const { cursoId } = await params;
  const course = await getCourse(cursoId);
  if (!course) notFound();

  const number = await getCourseNumber(course.id);
  const totalLessons = course.lessons.length;
  const hasStarted = course.completedLessons > 0;
  const isFinished = course.completedLessons >= totalLessons;
  const nextLesson = isFinished ? 1 : course.completedLessons + 1;
  const ctaLabel = isFinished ? "Assistir de novo" : hasStarted ? `Continuar da aula ${nextLesson}` : "Começar curso";

  const facts = [
    { label: "Aulas", value: formatLessonsCount(totalLessons) },
    { label: "Duração", value: formatDuration(getCourseMinutes(course)) },
    { label: "Tags", value: course.tags.map((tag) => courseTagLabels[tag]).join(", ") },
    { label: "Preço", value: "Gratuito" },
  ];

  return (
    <main className="flex flex-col pb-10 lg:pb-0">
      <div className="flex h-14 items-center px-2 lg:px-0">
        <Link
          href="/educacao/cursos"
          className="group flex h-11 items-center gap-2 rounded-full px-3 text-sm text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto lg:-ml-3"
        >
          <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
          Cursos da comunidade
        </Link>
      </div>

      <article aria-labelledby="titulo-curso" className="flex flex-col gap-10 lg:gap-14">
        <header className="grid gap-6 px-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12 lg:px-0">
          <div className="flex flex-col gap-5 lg:pt-4">
            <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
              <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
              Minicurso da comunidade
            </p>
            <h1
              id="titulo-curso"
              className="font-display text-[40px] leading-[0.98] font-medium tracking-[-0.045em] text-balance lg:text-[60px]"
            >
              {course.title}
            </h1>
            <p className="max-w-[56ch] text-[17px] leading-[1.65]">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ActionLink href={`/educacao/cursos/${course.id}/player?aula=${nextLesson}`}>
                {ctaLabel}
                <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </ActionLink>
              {hasStarted && !isFinished ? (
                <div className="flex min-w-40 flex-1 flex-col gap-1.5 sm:max-w-56">
                  <span className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
                    {course.completedLessons} de {totalLessons} aulas
                  </span>
                  <ProgressBar value={course.completedLessons} max={totalLessons} tone="comunidade" label="Progresso no minicurso" className="h-1" />
                </div>
              ) : null}
            </div>
          </div>
          <CourseCover pattern={course.cover} number={number} className="h-56 rounded-xl lg:h-full lg:min-h-80" />
        </header>

        <div className="grid gap-10 px-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:px-0">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-8 lg:self-start">
            <dl className="flex flex-col border-t border-linha">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 border-b border-linha py-3">
                  <dt className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">{fact.label}</dt>
                  <dd className="text-right text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/comunidade/pessoas/${course.author.username}`}
              className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-texto"
            >
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-medium ring-1 ring-linha transition-colors group-hover:ring-texto"
              >
                {course.author.name.charAt(0)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Criado por</span>
                <span className="text-[15px] font-medium">{course.author.name}</span>
                <span className="text-xs text-texto-secundario">{course.author.role}</span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 text-texto-secundario transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto"
                strokeWidth={2}
              />
            </Link>
          </aside>
          <CourseLessons course={course} />
        </div>
      </article>
    </main>
  );
}
