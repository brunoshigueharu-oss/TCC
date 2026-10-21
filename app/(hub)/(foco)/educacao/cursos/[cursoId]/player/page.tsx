import { ChevronRight, ListVideo, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { VideoPlaceholder } from "./_components/video-placeholder";
import { getCourseForPlayer, parseLessonNumber } from "./_data-access/get-course-lesson";

/** 0 → "Nenhuma pergunta ainda", 1 → "1 pergunta da comunidade" */
function formatQuestions(count: number) {
  if (count === 0) return "Nenhuma pergunta ainda. Seja a primeira pessoa a perguntar.";
  return count === 1 ? "1 pergunta da comunidade" : `${count} perguntas da comunidade`;
}

export async function generateMetadata({
  params,
}: PageProps<"/educacao/cursos/[cursoId]/player">): Promise<Metadata> {
  const { cursoId } = await params;
  const course = await getCourseForPlayer(cursoId);
  return { title: course ? `Aula · ${course.title}` : "Aula" };
}

/** Player do minicurso (Figma: "Player do minicurso"). A aula atual fica em `?aula=N`. */
export default async function CoursePlayerPage({
  params,
  searchParams,
}: PageProps<"/educacao/cursos/[cursoId]/player">) {
  const { cursoId } = await params;
  const course = await getCourseForPlayer(cursoId);
  if (!course) notFound();

  const total = course.lessons.length;
  const current = parseLessonNumber((await searchParams).aula, total);
  const lesson = course.lessons[current - 1];
  const upcoming = course.lessons.slice(current);
  const isFirst = current === 1;
  const isLast = current === total;
  const playerHref = (number: number) => `/educacao/cursos/${course.id}/player?aula=${number}`;

  return (
    <>
      <BackBar href={`/educacao/cursos/${course.id}`} label={course.title} />
      <main className="flex flex-col gap-7 pb-8">
        <div className="flex flex-col">
          <VideoPlaceholder />
          <div className="flex flex-col gap-2 rounded-b-[28px] bg-fundo px-4 pt-4 pb-5 ring-1 ring-linha/70">
            <p className="text-xs font-semibold text-texto-secundario">
              Aula {current} de {total}
            </p>
            <h1 className="font-display text-[22px] leading-tight font-bold">{lesson.title}</h1>
            <p className="text-sm text-texto-secundario">
              {course.title} · {lesson.minutes} min
            </p>
            <p className="pt-1 text-[15px] leading-normal">{lesson.summary}</p>
          </div>
        </div>

        <nav aria-label="Navegar entre aulas" className="flex gap-3 px-4">
          {isFirst ? null : (
            <ActionLink href={playerHref(current - 1)} variant="secondary" className="h-12 flex-1">
              Anterior
            </ActionLink>
          )}
          <ActionLink
            href={isLast ? `/educacao/cursos/${course.id}` : playerHref(current + 1)}
            className="flex-1"
          >
            {isLast ? "Concluir curso" : "Próxima aula"}
          </ActionLink>
        </nav>

        <SurfaceCard>
          <Link href={`/comunidade?tag=${course.tags[0]}`} className="flex items-center gap-3 px-4 py-3">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-comunidade"
            >
              <MessageCircle className="size-5 text-texto" strokeWidth={1.75} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[15px] font-semibold">Dúvidas desta aula</span>
              <span className="text-xs text-texto-secundario">{formatQuestions(lesson.questionsCount)}</span>
            </span>
            <ChevronRight aria-hidden className="size-5 text-texto-secundario" strokeWidth={2} />
          </Link>
        </SurfaceCard>

        {upcoming.length > 0 ? (
          <section aria-labelledby="proximas-aulas" className="flex flex-col gap-2">
            <SectionHeading id="proximas-aulas" title="Próximas aulas" icon={ListVideo} tone="comunidade" />
            <SurfaceCard>
              <ol className="divide-y divide-linha">
                {upcoming.map((item) => (
                  <li key={item.number}>
                    <Link href={playerHref(item.number)} className="flex min-h-12 items-center gap-3 px-4 py-3">
                      <span className="min-w-0 flex-1 text-[15px] leading-snug">
                        {item.number}. {item.title}
                      </span>
                      <span className="shrink-0 text-xs text-texto-secundario">{item.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </SurfaceCard>
          </section>
        ) : null}
      </main>
    </>
  );
}
