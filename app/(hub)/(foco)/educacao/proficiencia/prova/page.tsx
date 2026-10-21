import type { Metadata } from "next";

import { ProgressBar } from "@/components/progress-bar";
import { parseAnswers, serializeAnswers } from "@/lib/data/proficiencia";
import { getProficiency } from "../_data-access/get-proficiency";
import { ExamTopBar } from "./_components/exam-top-bar";
import { QuestionForm } from "./_components/question-form";

export const metadata: Metadata = { title: "Prova de proficiência" };

function firstValue(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Lê `?questao=N` e mantém o número dentro das questões da prova. */
function parseQuestion(raw: string | string[] | undefined, total: number) {
  const value = Number(firstValue(raw));
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, total);
}

/**
 * Prova do teste de proficiência (Figma: "Prova"). A questão atual e as
 * respostas dadas ficam na URL (`?questao=N&respostas=BCA`).
 */
export default async function ExamPage({ searchParams }: PageProps<"/educacao/proficiencia/prova">) {
  const proficiency = await getProficiency();
  const query = await searchParams;
  const total = proficiency.questions.length;
  const questionNumber = parseQuestion(query.questao, total);
  const answers = parseAnswers(firstValue(query.respostas), total);
  const answersParam = serializeAnswers(answers);
  const question = proficiency.questions[questionNumber - 1];
  const minutesLeft = (total - questionNumber + 1) * proficiency.minutesPerQuestion;

  const previousParams = new URLSearchParams({ questao: String(questionNumber - 1) });
  if (answersParam) {
    previousParams.set("respostas", answersParam);
  }

  return (
    <>
      <ExamTopBar minutesLeft={minutesLeft} />
      <main className="flex flex-col gap-6 pt-5 pb-8 lg:gap-8 lg:px-8 lg:pt-8">
        <div className="flex flex-col gap-2 px-4 lg:px-0">
          <p className="flex items-center justify-between text-xs text-texto-secundario">
            <span className="text-sm font-semibold text-texto">
              Questão {questionNumber} de {total}
            </span>
            Teste de proficiência
          </p>
          <ProgressBar value={questionNumber} max={total} label="Progresso na prova" />
        </div>

        <QuestionForm
          key={questionNumber}
          questionNumber={questionNumber}
          totalQuestions={total}
          text={question.text}
          options={question.options}
          savedAnswer={answers[questionNumber - 1]}
          answersParam={answersParam}
          previousHref={
            questionNumber > 1 ? `/educacao/proficiencia/prova?${previousParams.toString()}` : null
          }
        />
      </main>
    </>
  );
}
