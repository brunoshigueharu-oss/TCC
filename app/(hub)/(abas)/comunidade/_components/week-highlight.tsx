import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { WeekHighlight as WeekHighlightData } from "@/lib/data/comunidade";
import { formatAnswers } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";

type WeekHighlightProps = {
  highlight: WeekHighlightData;
};

/**
 * Destaque da semana da turma: o momento de cor da tela. Bloco azul (pilar
 * da comunidade) com a pergunta grande e o trecho da resposta aceita.
 */
export function WeekHighlight({ highlight }: WeekHighlightProps) {
  const { post, answer } = highlight;

  return (
    <section aria-labelledby="destaque-semana" className="mx-4 lg:mx-0">
      <Link
        href={`/comunidade/posts/${post.id}`}
        className="group/highlight relative flex flex-col gap-6 overflow-hidden rounded-xl bg-comunidade p-5 text-tinta outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:p-8"
      >
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase">
            <span aria-hidden className="size-2 rounded-[2px] bg-tinta" />
            <span id="destaque-semana">Destaque da semana</span>
            <span className="font-mono font-normal tracking-normal normal-case opacity-70">
              · {post.votes} votos · {formatAnswers(post.answersCount)}
            </span>
          </p>
          <h2 className="font-display text-[28px] leading-[1.04] font-medium tracking-[-0.04em] text-balance lg:text-[40px]">
            {post.title}
          </h2>
          <span className="mt-auto flex items-center gap-2 text-sm font-semibold">
            Ler a discussão
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover/highlight:translate-x-1"
              strokeWidth={2}
            />
          </span>
        </div>

        {answer ? (
          <figure className="flex flex-col gap-3 border-t border-tinta/25 pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <figcaption className="flex items-center gap-2 text-[13px] font-semibold">
              <PersonAvatar
                name={answer.author.name}
                size="xs"
                className="bg-tinta/15 text-tinta"
              />
              Resposta aceita · {answer.author.name}
            </figcaption>
            <blockquote className="line-clamp-5 text-[15px] leading-relaxed">
              {answer.body}
            </blockquote>
          </figure>
        ) : null}
      </Link>
    </section>
  );
}
