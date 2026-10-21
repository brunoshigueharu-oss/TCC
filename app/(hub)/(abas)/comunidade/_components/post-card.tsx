import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { getPersonHref, postTypeLabels, type PostSummary } from "@/lib/data/comunidade";
import { formatAnswers, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";

type PostCardProps = {
  post: PostSummary;
};

function formatVotes(count: number) {
  return count === 1 ? "1 voto" : `${count} votos`;
}

/**
 * Cartão de post do feed (Figma: "Feed por tags"). O título é o link
 * principal e cobre o cartão; autor e tags ficam por cima, como links próprios.
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <SurfaceCard as="article" className="relative flex flex-col gap-2 p-4 lg:p-5 lg:transition-colors lg:hover:ring-linha">
      <div className="flex items-center gap-2">
        <Link
          href={getPersonHref(post.author.username)}
          className="relative z-10 flex min-h-8 min-w-0 items-center gap-2 text-sm font-semibold"
        >
          <PersonAvatar username={post.author.username} name={post.author.name} />
          <span className="truncate">{post.author.name}</span>
        </Link>
        <span className="shrink-0 text-xs text-texto-secundario">· {post.timeAgo}</span>
        <span className="ml-auto shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-linha">
          {postTypeLabels[post.type]}
        </span>
      </div>

      <h3 className="text-[15px] leading-snug font-semibold lg:text-base">
        <Link href={`/comunidade/posts/${post.id}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="line-clamp-2 text-sm leading-[1.45] text-texto-secundario lg:text-[15px]">{post.body}</p>

      <ul aria-label="Tags" className="flex flex-wrap gap-1.5 pt-1">
        {post.tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              href={`/comunidade/tags/${tag.slug}`}
              className="relative z-10 flex h-7 items-center rounded-full bg-comunidade/15 px-2.5 text-xs font-semibold"
            >
              #{tag.slug}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-xs text-texto-secundario">
        {formatVotes(post.votes)} · {formatAnswers(post.answersCount)}
        {post.lesson ? ` · Lição ${formatTwoDigits(post.lesson.number)}` : null}
      </p>
    </SurfaceCard>
  );
}
