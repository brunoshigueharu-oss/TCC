"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";

import type { AnswerView, Person } from "@/lib/data/comunidade";
import { AnswerItem } from "./answer-item";
import { ReplyForm } from "./reply-form";

type DiscussionProps = {
  postId: string;
  answers: AnswerView[];
  currentPerson: Person;
};

/**
 * Respostas do post + campo de responder. A resposta enviada entra na lista
 * na hora (otimista); no protótipo ela não é gravada.
 */
export function Discussion({ postId, answers, currentPerson }: DiscussionProps) {
  const [sentAnswers, setSentAnswers] = useState<AnswerView[]>([]);
  const total = answers.length + sentAnswers.length;

  function handleSent(body: string) {
    setSentAnswers((current) => [
      ...current,
      {
        id: `enviada-${current.length + 1}`,
        author: currentPerson,
        timeAgo: "agora",
        body,
        votes: 0,
        isHelpful: false,
      },
    ]);
  }

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="respostas" className="flex flex-col">
        <h2
          id="respostas"
          className="flex min-h-11 items-center justify-between gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase"
        >
          <span className="flex items-center gap-2.5">
            <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
            Respostas
          </span>
          <span className="font-mono font-normal tracking-normal text-texto-secundario tabular-nums">
            {String(total).padStart(2, "0")}
          </span>
        </h2>

        {total === 0 ? (
          <p className="py-8 font-display text-[20px] leading-snug font-medium tracking-[-0.02em] text-texto-secundario">
            Ainda sem respostas. Se você já passou por isso, conte como resolveu.
          </p>
        ) : (
          <ol className="divide-y divide-linha">
            {answers.map((answer) => (
              <li key={answer.id}>
                <AnswerItem postId={postId} answer={answer} />
              </li>
            ))}
            <AnimatePresence initial={false}>
              {sentAnswers.map((answer) => (
                <motion.li
                  key={answer.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AnswerItem postId={postId} answer={answer} isJustSent />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </section>

      <ReplyForm postId={postId} onSent={handleSent} />
    </MotionConfig>
  );
}
