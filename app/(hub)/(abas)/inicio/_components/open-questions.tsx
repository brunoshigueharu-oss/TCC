import { MessageCircle } from "lucide-react";
import Link from "next/link";

import type { OpenQuestion } from "@/lib/data/home";
import { formatAnswers, formatTwoDigits } from "@/lib/format";
import { BauhausShapes } from "./bauhaus-shapes";
import { SectionHeading } from "@/components/section-heading";

type OpenQuestionsProps = {
  questions: OpenQuestion[];
};

function formatQuestionsTitle(count: number) {
  if (count === 0) return "Nenhuma dúvida aberta";
  return count === 1 ? "1 dúvida aberta nas suas aulas" : `${count} dúvidas abertas nas suas aulas`;
}

/** Dúvidas abertas no fio de dúvidas das aulas que a pessoa está fazendo. */
export function OpenQuestions({ questions }: OpenQuestionsProps) {
  return (
    <section aria-labelledby="duvidas" className="flex flex-col gap-2">
      <SectionHeading
        id="duvidas"
        title={formatQuestionsTitle(questions.length)}
        href="/comunidade"
        icon={MessageCircle}
        tone="comunidade"
      />

      <div className="mx-4 overflow-hidden rounded-2xl bg-fundo ring-1 ring-linha/70">
        <div className="flex items-center">
          <p className="flex-1 p-4 font-display text-lg leading-snug font-bold">
            Sua turma está tirando dúvidas agora
          </p>
          <div className="flex w-[36%] shrink-0 justify-center rounded-l-[999px] bg-comunidade/15 py-2">
            <BauhausShapes composition="duvidas" className="size-24" />
          </div>
        </div>

        <ul className="divide-y divide-linha border-t border-linha">
          {questions.map((question) => (
            <li key={question.id}>
              <Link href={question.href} className="flex flex-col gap-1 px-4 py-3">
                <span className="text-sm leading-[1.4] font-semibold">{question.title}</span>
                <span className="text-xs text-texto-secundario">
                  Lição {formatTwoDigits(question.lessonNumber)} · {formatAnswers(question.answers)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
