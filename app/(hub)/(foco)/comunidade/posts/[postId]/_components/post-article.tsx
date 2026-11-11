import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/app/(hub)/(abas)/comunidade/_components/code-block";
import { PersonAvatar } from "@/app/(hub)/(abas)/comunidade/_components/person-avatar";
import { SaveButton, VoteButton } from "@/app/(hub)/(abas)/comunidade/_components/post-reactions";
import { PostStatus } from "@/app/(hub)/(abas)/comunidade/_components/post-status";
import { TagLink } from "@/app/(hub)/(abas)/comunidade/_components/tag-link";
import { getPersonHref, type PostDetail } from "@/lib/data/comunidade";
import { formatTwoDigits } from "@/lib/format";

type PostArticleProps = {
  post: PostDetail;
};

/** O post em si: estado, título grande, autor, texto, prompt usado, tags e ações. */
export function PostArticle({ post }: PostArticleProps) {
  return (
    <article aria-labelledby="titulo-do-post" className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <PostStatus type={post.type} isSolved={post.isSolved} answersCount={post.answersCount} />
          {post.lesson ? (
            <Link
              href={`/educacao/licao/${post.lesson.id}`}
              className="group/lesson flex items-center gap-1 rounded-sm font-mono text-[11px] text-texto-secundario outline-none hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
            >
              Módulo {formatTwoDigits(post.lesson.moduleNumber)} · Lição {formatTwoDigits(post.lesson.number)}
              <ArrowUpRight
                aria-hidden
                className="size-3 transition-transform duration-200 group-hover/lesson:translate-x-0.5 group-hover/lesson:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          ) : null}
        </div>

        <h1
          id="titulo-do-post"
          className="font-display text-[30px] leading-[1.04] font-medium tracking-[-0.04em] text-balance lg:text-[44px]"
        >
          {post.title}
        </h1>

        <div className="flex items-center gap-2.5">
          <Link
            href={getPersonHref(post.author.username)}
            className="flex min-h-11 items-center gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-texto"
          >
            <PersonAvatar name={post.author.name} size="md" />
            <span className="flex flex-col">
              <span className="text-sm font-semibold hover:underline hover:underline-offset-4">{post.author.name}</span>
              <span className="font-mono text-[11px] text-texto-secundario">{post.timeAgo}</span>
            </span>
          </Link>
        </div>
      </header>

      <p className="text-base leading-[1.65] lg:text-[17px]">{post.body}</p>

      {post.snippet ? <CodeBlock snippet={post.snippet} /> : null}

      <ul aria-label="Tags" className="flex flex-wrap gap-x-4">
        {post.tags.map((tag) => (
          <li key={tag.slug}>
            <TagLink slug={tag.slug} className="text-[13px]" />
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 border-y border-linha py-1.5">
        <VoteButton
          reactionId={`post:${post.id}`}
          baseCount={post.votes}
          layout="inline"
          subject="este post"
          className="-ml-1.5"
        />
        <SaveButton postId={post.id} hasLabel />
      </div>
    </article>
  );
}
