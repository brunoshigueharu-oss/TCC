import Link from "next/link";

import { getPersonHref, type PostSummary } from "@/lib/data/comunidade";
import { formatAnswers, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";
import { SaveButton, VoteButton } from "./post-reactions";
import { PostStatus } from "./post-status";
import { TagLink } from "./tag-link";

type PostRowProps = {
  post: PostSummary;
  /** Esconde o autor (perfil da própria pessoa). */
  isAuthorHidden?: boolean;
};

/**
 * Um post como item de lista editorial: voto à esquerda, estado e metadados
 * em linha fina, título grande e apertado, uma linha de contexto, tags em
 * mono. O título é o link principal e cobre a linha inteira; voto, salvar,
 * autor e tags ficam por cima como controles próprios.
 */
export function PostRow({ post, isAuthorHidden = false }: PostRowProps) {
  return (
    <article className="group/row relative flex gap-2 py-5 pr-1 pl-2 transition-colors duration-200 hover:bg-superficie/60 lg:gap-4 lg:py-6 lg:pr-2 lg:pl-1">
      <VoteButton
        reactionId={`post:${post.id}`}
        baseCount={post.votes}
        subject="este post"
        className="-mt-1"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <PostStatus
            type={post.type}
            isSolved={post.isSolved}
            answersCount={post.answersCount}
          />
          <span className="font-mono text-[11px] text-texto-secundario">
            {post.timeAgo}
          </span>
          {post.lesson ? (
            <span className="font-mono text-[11px] text-texto-secundario">
              Lição {formatTwoDigits(post.lesson.number)}
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-[19px] leading-[1.18] font-medium tracking-[-0.025em] text-balance lg:text-[22px]">
          <Link
            href={`/comunidade/posts/${post.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-texto focus-visible:after:ring-inset"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover/row:bg-[length:100%_1px]">
              {post.title}
            </span>
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-texto-secundario lg:line-clamp-1 lg:text-[15px]">
          {post.body}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
          {isAuthorHidden ? null : (
            <Link
              href={getPersonHref(post.author.username)}
              className="relative z-10 -my-2 flex min-h-9 items-center gap-2 rounded-sm text-[13px] font-medium outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-texto"
            >
              <PersonAvatar name={post.author.name} size="xs" />
              {post.author.name}
            </Link>
          )}
          <ul aria-label="Tags" className="flex flex-wrap gap-x-3">
            {post.tags.map((tag) => (
              <li key={tag.slug}>
                <TagLink slug={tag.slug} />
              </li>
            ))}
          </ul>
          <span className="ml-auto font-mono text-[11px] tabular-nums text-texto-secundario">
            {formatAnswers(post.answersCount)}
          </span>
        </div>
      </div>

      <SaveButton
        postId={post.id}
        className="-mt-2.5 -mr-1 opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100 lg:focus-visible:opacity-100 lg:aria-pressed:opacity-100"
      />
    </article>
  );
}
