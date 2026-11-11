"use client";

import { Check, Plus } from "lucide-react";

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useReaction } from "../../../_lib/reactions-store";

type FollowTagButtonProps = {
  slug: string;
  baseFollowers: number;
};

/** Seguir a tag, com o número de seguidores atualizado na hora. */
export function FollowTagButton({ slug, baseFollowers }: FollowTagButtonProps) {
  const [isFollowing, toggle] = useReaction("follows", slug);
  const followers = baseFollowers + (isFollowing ? 1 : 0);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFollowing}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 active:scale-[0.98]",
          isFollowing
            ? "bg-texto text-fundo"
            : "bg-fundo text-texto ring-1 ring-linha hover:ring-texto",
        )}
      >
        {isFollowing ? (
          <Check aria-hidden className="size-4" strokeWidth={2.5} />
        ) : (
          <Plus aria-hidden className="size-4" strokeWidth={2.5} />
        )}
        {isFollowing ? "Seguindo" : "Seguir tag"}
      </button>
      <span
        aria-live="polite"
        className="font-mono text-xs tabular-nums text-texto-secundario"
      >
        {formatNumber(followers)} seguem
      </span>
    </div>
  );
}
