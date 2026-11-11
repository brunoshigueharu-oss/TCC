import type { LevelingQuestion } from "@/lib/data/entrada";

export type LevelingAnswer = { questionId: string; letter: string | null };

type LevelingTranscriptProps = {
  questions: LevelingQuestion[];
  answers: LevelingAnswer[];
};

/**
 * O que já foi conversado: cada pergunta respondida vira uma linha curta com
 * a resposta da pessoa logo abaixo, recuada como numa entrevista impressa.
 */
export function LevelingTranscript({ questions, answers }: LevelingTranscriptProps) {
  if (answers.length === 0) return null;

  return (
    <ol aria-label="Respostas anteriores" className="flex flex-col gap-4 border-l border-linha pl-4">
      {answers.map((answer, index) => {
        const question = questions.find((item) => item.id === answer.questionId);
        if (!question) return null;
        const option = question.options.find((item) => item.letter === answer.letter);
        return (
          <li key={answer.questionId} className="flex flex-col gap-1">
            <p className="flex gap-2 text-[13px] leading-snug text-texto-secundario">
              <span aria-hidden className="font-mono text-[11px] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="line-clamp-1">{question.statement}</span>
            </p>
            <p className="pl-6 text-[13px] leading-snug">
              <span className="sr-only">Sua resposta: </span>
              {option ? (
                <>
                  <span aria-hidden className="font-mono text-[11px] text-texto-secundario">
                    {option.letter} ·{" "}
                  </span>
                  {option.text}
                </>
              ) : (
                <span className="text-texto-secundario italic">Ainda não sei</span>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
