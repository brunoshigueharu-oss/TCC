import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { OpenQuestion } from "@/lib/data/home";
import { formatAnswers, formatTwoDigits } from "@/lib/format";

type OpenQuestionsProps = {
  questions: OpenQuestion[];
};

/** Dúvidas abertas no fio das aulas que a pessoa está fazendo: lista de linhas. */
export function OpenQuestions({ questions }: OpenQuestionsProps) {
  return (
    <section aria-labelledby="duvidas" className="flex flex-col lg:col-span-7">
      <SectionHeading
        id="duvidas"
        title="Dúvidas abertas da turma"
        href="/comunidade"
        tone="comunidade"
        meta={formatTwoDigits(questions.length)}
      />

      {questions.length === 0 ? (
        <p className="px-4 py-6 text-sm text-texto-secundario lg:px-0">
          Nenhuma dúvida aberta nas suas aulas. Quando alguém perguntar, aparece aqui.
        </p>
      ) : (
        <ul className="mx-4 divide-y divide-linha border-b border-linha lg:mx-0">
          {questions.map((question) => (
            <li key={question.id}>
              <Link
                href={question.href}
                className="group flex items-start gap-4 py-4 outline-none transition-colors hover:bg-superficie focus-visible:bg-superficie lg:-mx-3 lg:rounded-lg lg:px-3"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="text-[15px] leading-snug font-medium text-pretty lg:text-base">{question.title}</span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-texto-secundario">
                    <span>
                      {question.author} · Lição {formatTwoDigits(question.lessonNumber)}
                    </span>
                    <span className="font-mono tabular-nums">{question.timeLabel}</span>
                  </span>
                </span>
                <span
                  className={
                    question.answers === 0
                      ? "mt-0.5 shrink-0 rounded-full border border-texto px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
                      : "mt-0.5 shrink-0 py-0.5 text-xs whitespace-nowrap text-texto-secundario"
                  }
                >
                  {formatAnswers(question.answers)}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-desativado transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
