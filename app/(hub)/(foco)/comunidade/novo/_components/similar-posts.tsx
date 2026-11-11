"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

import type { PostTeaser } from "@/lib/data/comunidade";
import { formatAnswers } from "@/lib/format";

type SimilarPostsProps = {
  posts: PostTeaser[];
};

/**
 * Dúvidas parecidas, mostradas embaixo do título enquanto a pessoa escreve.
 * Abrem em nova aba para não perder o rascunho.
 */
export function SimilarPosts({ posts }: SimilarPostsProps) {
  return (
    <div aria-live="polite">
      <AnimatePresence initial={false}>
        {posts.length > 0 ? (
          <motion.section
            key="parecidas"
            aria-labelledby="parecidas-titulo"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 rounded-xl border border-linha p-4">
              <h2
                id="parecidas-titulo"
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase"
              >
                <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
                Talvez já tenham respondido
              </h2>
              <ul className="divide-y divide-linha">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/comunidade/posts/${post.id}`}
                      target="_blank"
                      className="group/similar flex items-center gap-3 rounded-sm py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-texto"
                    >
                      <span className="min-w-0 flex-1 text-[15px] leading-snug group-hover/similar:underline group-hover/similar:underline-offset-4">
                        {post.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-texto-secundario">
                        {post.isSolved ? "resolvida" : formatAnswers(post.answersCount)}
                      </span>
                      <ArrowUpRight aria-hidden className="size-3.5 shrink-0 text-texto-secundario" strokeWidth={2} />
                      <span className="sr-only">(abre em nova aba)</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
