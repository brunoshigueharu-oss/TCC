import Link from "next/link";

import { CodeBlock } from "@/app/(hub)/(abas)/comunidade/_components/code-block";
import { PersonAvatar } from "@/app/(hub)/(abas)/comunidade/_components/person-avatar";
import { VoteButton } from "@/app/(hub)/(abas)/comunidade/_components/post-reactions";
import { getPersonHref, HELPFUL_ANSWER_XP, type AnswerView } from "@/lib/data/comunidade";
import { cn } from "@/lib/utils";

type AnswerItemProps = {
  postId: string;
  answer: AnswerView;
  /** Resposta que a pessoa acabou de enviar (sem voto, com rótulo próprio). */
  isJustSent?: boolean;
};

/**
 * Uma resposta: autor e tempo em linha fina, texto, trecho de prompt/código e
 * voto. A aceita ganha um filete verde-água à esquerda e o selo em caixa alta.
 */
export function AnswerItem({ postId, answer, isJustSent = false }: AnswerItemProps) {
  const [firstName] = answer.author.name.split(" ");

  return (
    <article
      aria-label={`Resposta de ${answer.author.name}${answer.isHelpful ? ", aceita" : ""}`}
      className={cn(
        "flex flex-col gap-4 py-6",
        answer.isHelpful && "-mx-4 border-l-2 border-acao bg-acao/[0.06] px-4 lg:-mx-6 lg:px-6",
      )}
    >
      {answer.isHelpful ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold tracking-[0.08em] uppercase">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
            Resposta aceita
          </span>
          <span className="font-mono font-normal tracking-normal text-texto-secundario normal-case">
            +{HELPFUL_ANSWER_XP} XP para {firstName}
          </span>
        </p>
      ) : null}

      <div className="flex items-center gap-2.5">
        <Link
          href={getPersonHref(answer.author.username)}
          className="flex min-h-9 items-center gap-2.5 rounded-sm text-sm font-semibold outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-texto"
        >
          <PersonAvatar name={answer.author.name} size="sm" />
          {answer.author.name}
        </Link>
        <span className="font-mono text-[11px] text-texto-secundario">{answer.timeAgo}</span>
        {isJustSent ? (
          <span className="font-mono text-[11px] text-texto-secundario">· enviada agora</span>
        ) : null}
      </div>

      <p className="text-[15px] leading-relaxed whitespace-pre-line lg:text-base">{answer.body}</p>

      {answer.snippet ? <CodeBlock snippet={answer.snippet} /> : null}

      {isJustSent ? null : (
        <VoteButton
          reactionId={`answer:${postId}:${answer.id}`}
          baseCount={answer.votes}
          layout="inline"
          subject={`a resposta de ${firstName}`}
          className="-ml-1.5 self-start"
        />
      )}
    </article>
  );
}
