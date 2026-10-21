import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { ProgressBar } from "@/components/progress-bar";
import { SurfaceCard } from "@/components/surface-card";
import { formatTwoDigits } from "@/lib/format";
import { getLesson } from "../../_data-access/get-track";
import { LessonQuestions } from "./_components/lesson-questions";
import { LessonStepContent } from "./_components/lesson-step-content";

/** Lê `?etapa=N` e mantém o número dentro das etapas da lição. */
function parseStep(raw: string | string[] | undefined, total: number) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, total);
}

export async function generateMetadata({
  params,
}: PageProps<"/educacao/licao/[licaoId]">): Promise<Metadata> {
  const { licaoId } = await params;
  const found = await getLesson(licaoId);
  return { title: found ? found.lesson.title : "Lição" };
}

/** Lição da trilha (Figma: "Lição"). A etapa atual fica na URL. */
export default async function LessonPage({
  params,
  searchParams,
}: PageProps<"/educacao/licao/[licaoId]">) {
  const { licaoId } = await params;
  const found = await getLesson(licaoId);
  if (!found) notFound();

  const { trackModule, lesson } = found;
  const totalSteps = lesson.steps.length;
  const step = parseStep((await searchParams).etapa, totalSteps);
  const isLastStep = step === totalSteps;

  return (
    <>
      <BackBar href="/educacao" label={`Trilha · Módulo ${trackModule.number}`} />
      <main className="flex flex-col gap-5 pt-5 pb-8">
        <SurfaceCard className="flex flex-col gap-3 p-4">
          <p className="text-xs font-semibold text-texto-secundario">
            Lição {formatTwoDigits(lesson.number)} de {formatTwoDigits(trackModule.lessons.length)} ·
            Etapa {step} de {totalSteps}
          </p>
          <h1 className="font-display text-[22px] leading-tight font-bold">{lesson.title}</h1>
          <ProgressBar value={step} max={totalSteps} label="Progresso na lição" />
        </SurfaceCard>

        <LessonStepContent step={lesson.steps[step - 1]} />

        <div className="px-4">
          {isLastStep ? (
            <ActionLink href="/educacao">Concluir lição</ActionLink>
          ) : (
            <ActionLink href={`/educacao/licao/${lesson.id}?etapa=${step + 1}`}>Continuar</ActionLink>
          )}
        </div>

        {lesson.questionsCount > 0 ? (
          <LessonQuestions count={lesson.questionsCount} questions={lesson.questions} />
        ) : null}
      </main>
    </>
  );
}
