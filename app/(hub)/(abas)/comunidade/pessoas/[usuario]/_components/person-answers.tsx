import { Check } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { PersonAnswer } from "@/lib/data/comunidade";

type PersonAnswersProps = {
  firstName: string;
  answers: PersonAnswer[];
};

/** Respostas que a pessoa deu, com o post de origem e a marca de aceita. */
export function PersonAnswers({ firstName, answers }: PersonAnswersProps) {
  return (
    <section aria-labelledby="respostas-pessoa" className="flex flex-col">
      <SectionHeading
        id="respostas-pessoa"
        title="Respostas"
        tone="acao"
        meta={String(answers.length).padStart(2, "0")}
      />
      {answers.length === 0 ? (
        <p className="mx-4 py-6 text-sm text-texto-secundario lg:mx-0">
          {firstName} ainda não respondeu ninguém.
        </p>
      ) : (
        <ul className="mx-4 divide-y divide-linha lg:mx-0">
          {answers.map((answer) => (
            <li key={`${answer.postId}-${answer.timeAgo}`}>
              <Link
                href={`/comunidade/posts/${answer.postId}`}
                className="group/answer flex flex-col gap-2 rounded-sm py-5 outline-none focus-visible:ring-2 focus-visible:ring-texto"
              >
                <span className="flex items-center gap-3 font-mono text-[11px] text-texto-secundario">
                  {answer.isHelpful ? (
                    <span className="flex items-center gap-1.5 font-sans font-semibold tracking-[0.08em] text-texto uppercase">
                      <span
                        aria-hidden
                        className="flex size-3 items-center justify-center rounded-[3px] bg-acao text-tinta"
                      >
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                      Aceita
                    </span>
                  ) : null}
                  {answer.timeAgo}
                </span>
                <span className="text-[13px] text-texto-secundario">
                  em “{answer.postTitle}”
                </span>
                <span className="line-clamp-2 text-[15px] leading-relaxed group-hover/answer:underline group-hover/answer:decoration-linha group-hover/answer:underline-offset-4">
                  {answer.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
