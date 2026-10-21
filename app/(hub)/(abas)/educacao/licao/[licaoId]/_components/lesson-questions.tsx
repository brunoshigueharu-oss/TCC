import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { LessonQuestion } from "@/lib/data/trilha";
import { formatAnswers } from "@/lib/format";

type LessonQuestionsProps = {
  count: number;
  questions: LessonQuestion[];
};

/** Fio de dúvidas da aula: a ponte entre a lição e a Comunidade. */
export function LessonQuestions({ count, questions }: LessonQuestionsProps) {
  return (
    <section aria-labelledby="duvidas-da-aula" className="flex flex-col gap-2">
      <SectionHeading
        id="duvidas-da-aula"
        title={`Dúvidas desta aula · ${count}`}
        href="/comunidade"
        icon={MessageCircle}
        tone="comunidade"
      />

      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {questions.map((question) => (
            <li key={question.id}>
              <Link href={`/comunidade/posts/${question.id}`} className="flex flex-col gap-1 px-4 py-3">
                <span className="text-sm leading-[1.4] font-semibold">{question.title}</span>
                <span className="text-xs text-texto-secundario">
                  {question.author} · {formatAnswers(question.answers)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </section>
  );
}
