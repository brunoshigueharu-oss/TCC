import type { Metadata } from "next";
import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import { SurfaceCard } from "@/components/surface-card";
import { parsePosition } from "../_lib/parse-position";
import { LevelingForm } from "./_components/leveling-form";
import { getLevelingQuestions } from "./_data-access/get-leveling";

export const metadata: Metadata = { title: "Nivelamento" };

/**
 * Nivelamento (Figma: "Nivelamento"). Perguntas de múltipla escolha que
 * posicionam a pessoa na trilha; a pergunta atual fica na URL
 * (`?pergunta=N`). A última, ou "Pular nivelamento", leva para a Home.
 */
export default async function LevelingPage({ searchParams }: PageProps<"/nivelamento">) {
  const questions = await getLevelingQuestions();
  const position = parsePosition((await searchParams).pergunta, questions.length);
  const question = questions[position - 1];
  const isLastQuestion = position === questions.length;

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-fundo px-4 pt-2 pb-3 ring-1 ring-linha/70 lg:static lg:mx-6 lg:rounded-2xl lg:px-6 lg:pt-3 lg:pb-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold">
            Pergunta {position} de {questions.length}
          </p>
          <Link
            href="/inicio"
            className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
          >
            Pular nivelamento
          </Link>
        </div>
        <ProgressBar value={position} max={questions.length} label="Progresso do nivelamento" />
      </header>

      <main className="flex flex-1 flex-col gap-5 pt-5 pb-6 lg:flex-none lg:gap-6 lg:px-6 lg:pt-6 lg:pb-0">
        <SurfaceCard className="flex flex-col gap-2 p-4 lg:p-6">
          <p className="text-xs font-semibold text-texto-secundario">{question.topic}</p>
          <h1 className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">{question.statement}</h1>
        </SurfaceCard>

        <LevelingForm
          key={question.id}
          questionId={question.id}
          statement={question.statement}
          options={question.options}
          nextHref={isLastQuestion ? "/inicio" : `/nivelamento?pergunta=${position + 1}`}
          submitLabel={isLastQuestion ? "Concluir nivelamento" : "Responder"}
        />
      </main>
    </>
  );
}
