import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { PersonPost } from "@/lib/data/pessoas";
import { formatAnswers } from "@/lib/format";

type PersonPostsProps = {
  firstName: string;
  posts: PersonPost[];
};

function formatLikes(count: number) {
  return count === 1 ? "1 curtida" : `${count} curtidas`;
}

/** Posts publicados pela pessoa na comunidade. */
export function PersonPosts({ firstName, posts }: PersonPostsProps) {
  return (
    <section aria-labelledby="posts-pessoa" className="flex flex-col gap-2">
      <SectionHeading id="posts-pessoa" title="Posts" icon={MessageCircle} tone="comunidade" />
      <SurfaceCard>
        {posts.length > 0 ? (
          <ul className="divide-y divide-linha">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/comunidade/posts/${post.id}`} className="flex flex-col gap-1.5 px-4 py-3 lg:px-5 lg:py-4 lg:transition-colors lg:hover:bg-superficie">
                  <span className="w-fit rounded-full bg-comunidade/15 px-2.5 py-0.5 text-xs font-semibold">
                    #{post.tag}
                  </span>
                  <span className="text-sm leading-[1.4] font-semibold lg:text-[15px]">{post.title}</span>
                  <span className="text-xs text-texto-secundario">
                    {formatAnswers(post.answers)} · {formatLikes(post.likes)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-4 text-sm text-texto-secundario">
            {firstName} ainda não publicou na comunidade.
          </p>
        )}
      </SurfaceCard>
    </section>
  );
}
