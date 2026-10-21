import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { getPersonHref, HELPFUL_ANSWER_XP, type AnswerView } from "@/lib/data/comunidade";
import { PersonAvatar } from "./person-avatar";

type AnswerListProps = {
  answers: AnswerView[];
};

/** Respostas do post. A marcada como útil mostra o selo e o XP ganho. */
export function AnswerList({ answers }: AnswerListProps) {
  return (
    <section aria-labelledby="respostas" className="flex flex-col gap-2">
      <SectionHeading
        id="respostas"
        title={`Respostas (${answers.length})`}
        icon={MessageCircle}
        tone="comunidade"
      />

      <SurfaceCard>
        {answers.length === 0 ? (
          <p className="p-4 text-sm leading-[1.45] text-texto-secundario">
            Ainda sem respostas. Se você já passou por isso, compartilhe como resolveu.
          </p>
        ) : (
          <ul className="divide-y divide-linha">
            {answers.map((answer) => (
              <li key={answer.id} className="flex flex-col gap-2 px-4 py-3 lg:px-6 lg:py-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={getPersonHref(answer.author.username)}
                    className="flex min-h-8 min-w-0 items-center gap-2 text-sm font-semibold"
                  >
                    <PersonAvatar username={answer.author.username} name={answer.author.name} />
                    <span className="truncate">{answer.author.name}</span>
                  </Link>
                  <span className="shrink-0 text-xs text-texto-secundario">· {answer.timeAgo}</span>
                </div>
                <p className="text-sm leading-[1.5]">{answer.body}</p>
                {answer.isHelpful ? (
                  <p className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-md bg-acao px-2 py-1">Marcada como útil</span>
                    <span>
                      +{HELPFUL_ANSWER_XP} XP para {answer.author.name.split(" ")[0]}
                    </span>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>
    </section>
  );
}
