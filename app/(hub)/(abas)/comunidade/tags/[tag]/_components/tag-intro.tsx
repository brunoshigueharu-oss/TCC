import type { CommunityTag } from "@/lib/data/comunidade";
import { FollowTagButton } from "./follow-tag-button";

type TagIntroProps = {
  tag: CommunityTag;
  postsCount: number;
  solvedCount: number;
};

/** Cabeçalho tipográfico da tag: `#slug` grande, descrição, números e Seguir. */
export function TagIntro({ tag, postsCount, solvedCount }: TagIntroProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-linha px-4 pt-8 pb-6 lg:px-0 lg:pt-6 lg:pb-8">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
        <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
        Tag · {tag.label}
      </p>
      <h1 className="font-mono text-[40px] leading-none font-medium tracking-[-0.04em] lg:text-[64px]">
        #{tag.slug}
      </h1>
      <p className="max-w-[52ch] text-[15px] leading-relaxed text-texto-secundario lg:text-base">
        {tag.description}
      </p>
      <dl className="flex gap-8">
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            Posts
          </dt>
          <dd className="font-display text-[28px] leading-none font-light tabular-nums">
            {postsCount}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            Resolvidos
          </dt>
          <dd className="font-display text-[28px] leading-none font-light tabular-nums">
            {solvedCount}
          </dd>
        </div>
      </dl>
      <FollowTagButton slug={tag.slug} baseFollowers={tag.followers} />
    </header>
  );
}
