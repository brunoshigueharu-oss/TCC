import { Check, Plus } from "lucide-react";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import type { CommunityTag } from "@/lib/data/comunidade";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BauhausShapes } from "./bauhaus-shapes";

type TagIntroProps = {
  tag: CommunityTag;
  postsCount: number;
  isFollowing: boolean;
  /** Link que alterna seguir/deixar de seguir (estado na URL, no protótipo). */
  toggleFollowHref: string;
};

function formatPosts(count: number) {
  return count === 1 ? "1 post" : `${formatNumber(count)} posts`;
}

/** Cabeçalho da página da tag: nome, descrição, números e botão Seguir. */
export function TagIntro({ tag, postsCount, isFollowing, toggleFollowHref }: TagIntroProps) {
  const followers = tag.followers + (isFollowing ? 1 : 0);

  return (
    <SurfaceCard className="flex flex-col">
      <div className="flex items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
          <p className="text-xs font-semibold text-texto-secundario">Tag</p>
          <h1 className="font-display text-[22px] leading-tight font-bold">#{tag.slug}</h1>
          <p className="text-xs text-texto-secundario">
            {formatPosts(postsCount)} · {formatNumber(followers)} seguidores
          </p>
        </div>
        <div className="flex w-[34%] shrink-0 justify-center rounded-l-[999px] bg-comunidade/15 py-2">
          <BauhausShapes className="size-24" />
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-linha p-4">
        <p className="text-sm leading-[1.45]">{tag.description}</p>
        <Link
          href={toggleFollowHref}
          scroll={false}
          aria-pressed={isFollowing}
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors",
            isFollowing ? "bg-texto text-fundo" : "bg-fundo ring-1 ring-linha",
          )}
        >
          {isFollowing ? (
            <Check aria-hidden className="size-4" strokeWidth={2.5} />
          ) : (
            <Plus aria-hidden className="size-4" strokeWidth={2.5} />
          )}
          {isFollowing ? "Seguindo" : "Seguir tag"}
        </Link>
      </div>
    </SurfaceCard>
  );
}
