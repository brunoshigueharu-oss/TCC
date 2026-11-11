import Link from "next/link";

import type { PostSummary } from "@/lib/data/comunidade";
import { cn } from "@/lib/utils";
import { PostRow } from "./post-row";

// Entrada em cascata curta (classes literais; o Tailwind não enxerga nomes montados).
const staggerClasses = [
  "[animation-delay:0ms]",
  "[animation-delay:40ms]",
  "[animation-delay:80ms]",
  "[animation-delay:120ms]",
  "[animation-delay:160ms]",
  "[animation-delay:200ms]",
  "[animation-delay:240ms]",
] as const;

type PostListProps = {
  posts: PostSummary[];
  /** Texto quando a lista está vazia. */
  emptyMessage: string;
  /** Esconde o autor em cada linha (lista de uma pessoa só). */
  isAuthorHidden?: boolean;
  /** Mostra o convite "Escrever o primeiro post" no estado vazio. */
  hasEmptyAction?: boolean;
};

/** Lista de posts separada por linhas finas, com estado vazio tipográfico. */
export function PostList({
  posts,
  emptyMessage,
  isAuthorHidden = false,
  hasEmptyAction = true,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="mx-4 flex flex-col items-start gap-3 border-b border-linha py-10 lg:mx-0">
        <p className="max-w-[40ch] font-display text-[22px] leading-tight font-medium tracking-[-0.02em]">
          {emptyMessage}
        </p>
        {hasEmptyAction ? (
          <Link
            href="/comunidade/novo"
            className="text-sm font-semibold underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-texto"
          >
            Escrever o primeiro post
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <ol className="mx-2 divide-y divide-linha border-b border-linha lg:mx-0">
      {posts.map((post, index) => (
        <li
          key={post.id}
          className={cn(
            "animate-fade-up",
            staggerClasses[Math.min(index, staggerClasses.length - 1)],
          )}
        >
          <PostRow post={post} isAuthorHidden={isAuthorHidden} />
        </li>
      ))}
    </ol>
  );
}
