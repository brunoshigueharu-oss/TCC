import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { getCourseEditorData } from "./_data-access/get-course-draft";
import { CourseOutline } from "./_components/course-outline";
import { LessonEditor } from "./_components/lesson-editor";
import { PublishPanel } from "./_components/publish-panel";

export const metadata: Metadata = { title: "Criar minicurso" };

/**
 * Criar minicurso (web, Figma 61:49): estrutura das aulas à esquerda, edição
 * da aula aberta (`?aula=N`) no centro, prévia e publicação à direita.
 */
export default async function CreateCoursePage({ searchParams }: PageProps<"/criar-minicurso">) {
  const { aula } = await searchParams;
  const { course, lesson, lessonNumber, isNewLesson, totalMinutes, checklist } =
    await getCourseEditorData(Array.isArray(aula) ? aula[0] : aula);
  const totalLessons = course.lessons.length + (isNewLesson ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-6 pb-16 lg:px-10 lg:pt-8">
      <header className="flex flex-col gap-2">
        <Link
          href="/educacao/cursos"
          className="flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-texto-secundario"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={2} />
          Cursos da comunidade
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[28px] leading-tight font-bold">{course.title}</h1>
          <span className="rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-texto">Rascunho</span>
        </div>
        <p className="text-sm text-texto-secundario">
          As alterações ficam no rascunho até você publicar.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <CourseOutline
          course={course}
          totalMinutes={totalMinutes}
          activeNumber={lessonNumber}
          isNewLesson={isNewLesson}
        />
        <SurfaceCard as="section" aria-label="Edição da aula" className="mx-0 self-start">
          <LessonEditor
            key={lesson.id}
            courseId={course.id}
            lesson={lesson}
            lessonNumber={lessonNumber}
            totalLessons={totalLessons}
          />
        </SurfaceCard>
        <div className="lg:col-span-2 xl:col-span-1">
          <PublishPanel course={course} totalMinutes={totalMinutes} checklist={checklist} />
        </div>
      </div>
    </div>
  );
}
