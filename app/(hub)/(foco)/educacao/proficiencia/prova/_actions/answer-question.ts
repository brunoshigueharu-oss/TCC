"use server";

import { redirect } from "next/navigation";

import {
  examAnswerSchema,
  parseAnswers,
  proficiency,
  serializeAnswers,
} from "@/lib/data/proficiencia";

export type AnswerQuestionResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<"answer", string[]>>;
};

/**
 * Registra a alternativa da questão e avança. As respostas vivem na URL
 * (`?respostas=`); na última questão leva ao resultado. No protótipo não há
 * banco: a versão real grava cada resposta na tentativa da pessoa.
 */
export async function answerQuestion(
  questionNumber: number,
  previousAnswers: string,
  input: unknown,
): Promise<AnswerQuestionResult> {
  const total = proficiency.questions.length;
  if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > total) {
    return { success: false, message: "Questão inválida." };
  }

  const validation = examAnswerSchema.safeParse(input);
  if (!validation.success || !validation.data.answer) {
    return {
      success: false,
      errors: validation.success
        ? { answer: ["Escolha uma alternativa para continuar."] }
        : validation.error.flatten().fieldErrors,
    };
  }

  const answers = parseAnswers(previousAnswers, total);
  answers[questionNumber - 1] = validation.data.answer;
  const serialized = serializeAnswers(answers);

  if (questionNumber === total) {
    redirect(`/educacao/proficiencia/resultado?respostas=${serialized}`);
  }
  redirect(`/educacao/proficiencia/prova?questao=${questionNumber + 1}&respostas=${serialized}`);
}
