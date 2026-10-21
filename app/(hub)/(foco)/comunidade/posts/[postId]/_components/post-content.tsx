import { ArrowUp, BookOpen } from "lucide-react";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { getPersonHref, postTypeLabels, type PostDetail } from "@/lib/data/comunidade";
import { formatAnswers, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";

type PostContentProps = {
  post: PostDetail;
};

/** Cartão principal do post: autor, lição ligada, título, texto, tags e números. */
export function PostContent({ post }: PostContentProps) {
  return (
    <SurfaceCard as="article" aria-labelledby="titulo-do-post" className="flex flex-col gap-3 p-4 lg:gap-4 lg:p-6">
      <div className="flex items-center gap-2">
        <Link
          href={getPersonHref(post.author.username)}
          className="flex min-h-11 min-w-0 items-center gap-2"
        >
          <PersonAvatar username={post.author.username} name={post.author.name} className="size-10 text-sm" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">{post.author.name}</span>
            <span className="text-xs text-texto-secundario">{post.timeAgo}</span>
          </span>
        </Link>
        <span className="ml-auto shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-linha">
          {postTypeLabels[post.type]}
        </span>
      </div>

      {post.lesson ? (
        <Link
          href={`/educacao/licao/${post.lesson.id}`}
          className="flex w-fit items-center gap-2 rounded-lg bg-trilha/30 px-2.5 py-1.5 text-xs font-semibold"
        >
          <BookOpen aria-hidden className="size-3.5" strokeWidth={2} />
          Dúvida da Lição {formatTwoDigits(post.lesson.number)} · Módulo {post.lesson.moduleNumber}
        </Link>
      ) : null}

      <h1 id="titulo-do-post" className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">
        {post.title}
      </h1>
      <p className="text-[15px] leading-[1.5] lg:text-base lg:leading-relaxed">{post.body}</p>

      <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              href={`/comunidade/tags/${tag.slug}`}
              className="flex h-8 items-center rounded-full bg-comunidade/15 px-3 text-xs font-semibold"
            >
              #{tag.slug}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 border-t border-linha pt-3">
        <span className="flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold ring-1 ring-linha">
          <ArrowUp aria-hidden className="size-4" strokeWidth={2.5} />
          {post.votes} votos
        </span>
        <span className="text-sm text-texto-secundario">{formatAnswers(post.answersCount)}</span>
      </div>
    </SurfaceCard>
  );
}
