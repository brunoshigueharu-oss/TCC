import { CircleCheck, MessagesSquare, Plus, Users } from "lucide-react";
import type { Metadata } from "next";

import { ActionLink } from "@/components/action-link";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { PostList } from "./_components/post-list";
import { TagFilter } from "./_components/tag-filter";
import { getFeed } from "./_data-access/get-feed";

export const metadata: Metadata = { title: "Comunidade" };

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Feed por tags (Figma: "Feed por tags"). O filtro ativo fica em `?tag=`. */
export default async function CommunityPage({ searchParams }: PageProps<"/comunidade">) {
  const query = await searchParams;
  const { tags, activeTag, posts } = await getFeed(readParam(query.tag));
  const isJustPublished = readParam(query.publicado) === "1";

  return (
    <div className="flex flex-1 flex-col bg-superficie">
      <PageHeader
        title="Comunidade"
        subtitle="Dúvidas e discussões da turma"
        icon={Users}
        tone="comunidade"
      >
        <TagFilter tags={tags} activeSlug={activeTag?.slug ?? null} />
        <ActionLink href="/comunidade/novo" className="gap-2">
          <Plus aria-hidden className="size-5" strokeWidth={2} />
          Criar post
        </ActionLink>
      </PageHeader>

      <main className="flex flex-col gap-7 pt-7 pb-8">
        {isJustPublished ? (
          <SurfaceCard role="status" className="flex items-start gap-3 p-4">
            <CircleCheck aria-hidden className="size-5 shrink-0 text-acao" strokeWidth={2} />
            <p className="text-sm leading-[1.45]">
              Post publicado. Neste protótipo ele não fica salvo, mas a validação foi feita.
            </p>
          </SurfaceCard>
        ) : null}

        <section aria-labelledby="posts" className="flex flex-col gap-2">
          <SectionHeading
            id="posts"
            title={activeTag ? `Posts em ${activeTag.label}` : "Posts recentes"}
            href={activeTag ? `/comunidade/tags/${activeTag.slug}` : undefined}
            icon={MessagesSquare}
            tone="comunidade"
          />
          <PostList
            posts={posts}
            emptyMessage="Ainda não há posts com esta tag. Que tal abrir a primeira conversa?"
          />
        </section>
      </main>
    </div>
  );
}
