import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { formatTwoDigits } from "@/lib/format";
import { getCourseEditorData } from "./_data-access/get-course-draft";
import { CourseOutline } from "./_components/course-outline";
import { LessonEditor } from "./_components/lesson-editor";
import { PublishPanel } from "./_components/publish-panel";

export const metadata: Metadata = { title: "Criar minicurso" };

/**
 * Criar minicurso (web): mesa de trabalho em três colunas separadas por
 * linhas — estrutura das aulas, edição da aula aberta (`?aula=N`) e prévia
 * com o checklist de publicação.
 */
export default async function CreateCoursePage({ searchParams }: PageProps<"/criar-minicurso">) {
  const { aula } = await searchParams;
  const { course, lesson, lessonNumber, isNewLesson, totalMinutes, checklist } =
    await getCourseEditorData(Array.isArray(aula) ? aula[0] : aula);
  const totalLessons = course.lessons.length + (isNewLesson ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:px-10">
      <header className="flex flex-col gap-4 border-b border-linha pt-6 pb-6 lg:flex-row lg:items-end lg:justify-between lg:pt-10">
        <div className="flex min-w-0 flex-col gap-3">
          <Link
            href="/educacao/cursos"
            className="group flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
          >
            <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
            Cursos da comunidade
          </Link>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
            Minicurso · rascunho
          </p>
          <h1 className="font-display text-[32px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[48px]">
            {course.title}
          </h1>
        </div>
        <dl className="flex shrink-0 gap-8 font-mono text-[11px] text-texto-secundario uppercase">
          <div className="flex flex-col gap-1">
            <dt>Aulas</dt>
            <dd className="font-display text-[28px] leading-none font-medium tracking-[-0.03em] text-texto tabular-nums normal-case">
              {formatTwoDigits(course.lessons.length)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt>Duração</dt>
            <dd className="font-display text-[28px] leading-none font-medium tracking-[-0.03em] text-texto tabular-nums normal-case">
              {totalMinutes}
              <span className="ml-1 text-sm text-texto-secundario">min</span>
            </dd>
          </div>
        </dl>
      </header>

      <div className="grid flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:divide-x lg:divide-linha xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <CourseOutline
          course={course}
          totalMinutes={totalMinutes}
          activeNumber={lessonNumber}
          isNewLesson={isNewLesson}
        />
        <section aria-label="Edição da aula" className="border-t border-linha py-6 lg:border-t-0 lg:px-8 lg:py-8">
          <LessonEditor
            key={lesson.id}
            courseId={course.id}
            lesson={lesson}
            lessonNumber={lessonNumber}
            totalLessons={totalLessons}
          />
        </section>
        <div className="border-t border-linha py-6 lg:col-span-2 lg:pl-0 xl:col-span-1 xl:border-t-0 xl:py-8 xl:pl-8">
          <PublishPanel course={course} totalMinutes={totalMinutes} checklist={checklist} />
        </div>
      </div>
    </div>
  );
}
