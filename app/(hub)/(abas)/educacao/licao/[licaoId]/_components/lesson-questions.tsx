import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { LessonQuestion } from "@/lib/data/trilha";
import { formatAnswers, formatTwoDigits } from "@/lib/format";

type LessonQuestionsProps = {
  count: number;
  questions: LessonQuestion[];
};

/** Fio de dúvidas da aula: a ponte entre a lição e a Comunidade. */
export function LessonQuestions({ count, questions }: LessonQuestionsProps) {
  return (
    <section aria-labelledby="duvidas-da-aula" className="flex flex-col">
      <h2 id="duvidas-da-aula" className="border-b border-linha">
        <Link
          href="/comunidade"
          className="group flex min-h-11 items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase outline-none focus-visible:underline"
        >
          <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
          Dúvidas desta aula
          <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
            {formatTwoDigits(count)}
          </span>
          <ArrowUpRight
            aria-hidden
            className="ml-auto size-3.5 text-texto-secundario transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto"
            strokeWidth={2}
          />
        </Link>
      </h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="border-b border-linha">
            <Link
              href={`/comunidade/posts/${question.id}`}
              className="flex flex-col gap-1 py-3 outline-none transition-[padding,background-color] duration-200 hover:bg-superficie hover:px-3 focus-visible:ring-2 focus-visible:ring-texto"
            >
              <span className="text-sm leading-snug font-medium">{question.title}</span>
              <span className="text-xs text-texto-secundario">
                {question.author} · {formatAnswers(question.answers)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
