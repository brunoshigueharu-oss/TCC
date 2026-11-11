import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGlossary, getLesson, getNextLesson, getPlaygroundScenario } from "../../_data-access/get-track";
import { LessonPlayer } from "./_components/lesson-player";
import { LessonQuestions } from "./_components/lesson-questions";

/** Lê `?etapa=N` e devolve o índice (0-based) dentro das etapas da lição. */
function parseStep(raw: string | string[] | undefined, total: number) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(value) || value < 1) return 0;
  return Math.min(value, total) - 1;
}

export async function generateMetadata({ params }: PageProps<"/educacao/licao/[licaoId]">): Promise<Metadata> {
  const { licaoId } = await params;
  const found = await getLesson(licaoId);
  return { title: found ? found.lesson.title : "Lição" };
}

/** Lição da trilha (Figma: "Lição"). A etapa atual fica na URL. */
export default async function LessonPage({ params, searchParams }: PageProps<"/educacao/licao/[licaoId]">) {
  const { licaoId } = await params;
  const found = await getLesson(licaoId);
  if (!found) notFound();

  const { trackModule, lesson } = found;
  const [nextLesson, glossary, scenario] = await Promise.all([
    getNextLesson(trackModule, lesson.id),
    getGlossary(),
    getPlaygroundScenario(),
  ]);
  const rawStep = (await searchParams).etapa;
  const initialStep = parseStep(rawStep, lesson.steps.length);
  const isInitiallyComplete = rawStep === "fim";

  return (
    <LessonPlayer
      lesson={lesson}
      moduleId={trackModule.id}
      moduleNumber={trackModule.number}
      moduleLessonsCount={trackModule.lessons.length}
      nextLesson={nextLesson ? { id: nextLesson.id, number: nextLesson.number, title: nextLesson.title } : null}
      glossary={glossary}
      scenario={scenario}
      initialStep={initialStep}
      isInitiallyComplete={isInitiallyComplete}
      sideContent={
        lesson.questionsCount > 0 ? (
          <LessonQuestions count={lesson.questionsCount} questions={lesson.questions} />
        ) : null
      }
    />
  );
}
