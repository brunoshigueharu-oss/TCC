import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PostStatus } from "@/app/(hub)/(abas)/comunidade/_components/post-status";
import type { PostSummary } from "@/lib/data/comunidade";
import { formatAnswers } from "@/lib/format";

type RelatedPostsProps = {
  posts: PostSummary[];
};

/** "Dúvidas parecidas": posts que dividem tags com este, os mais votados primeiro. */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="duvidas-parecidas" className="flex flex-col">
      <h2
        id="duvidas-parecidas"
        className="flex min-h-11 items-center gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
        Dúvidas parecidas
      </h2>
      <ul className="divide-y divide-linha">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/comunidade/posts/${post.id}`}
              className="group/related flex items-center gap-4 rounded-sm py-4 outline-none focus-visible:ring-2 focus-visible:ring-texto"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="font-display text-[17px] leading-snug font-medium tracking-[-0.02em] group-hover/related:underline group-hover/related:underline-offset-4">
                  {post.title}
                </span>
                <span className="flex items-center gap-3">
                  <PostStatus type={post.type} isSolved={post.isSolved} answersCount={post.answersCount} />
                  <span className="font-mono text-[11px] text-texto-secundario">{formatAnswers(post.answersCount)}</span>
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-texto-secundario transition-transform duration-200 group-hover/related:translate-x-1 group-hover/related:text-texto"
                strokeWidth={2}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
