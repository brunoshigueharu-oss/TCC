import { CircleCheck, PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ActionLink } from "@/components/action-link";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { formatNumber } from "@/lib/format";
import { PostList } from "./_components/post-list";
import { SavedPosts } from "./_components/saved-posts";
import { UnderlineTabs } from "./_components/underline-tabs";
import { WeekHighlight } from "./_components/week-highlight";
import {
  getFeed,
  parseFeedOrder,
  type FeedOrder,
} from "./_data-access/get-feed";

export const metadata: Metadata = { title: "Comunidade" };

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

const orderLabels: Record<FeedOrder, string> = {
  recentes: "Recentes",
  votados: "Mais votados",
  "sem-resposta": "Sem resposta",
};

/** Monta a URL do feed mantendo tag e ordem. */
function buildFeedHref(tag: string | null, order: FeedOrder) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (order !== "recentes") params.set("ordem", order);
  const query = params.toString();
  return query ? `/comunidade?${query}` : "/comunidade";
}

function formatPostsCount(count: number) {
  return count === 1 ? "1 post" : `${formatNumber(count)} posts`;
}

/**
 * Feed da Comunidade: lista editorial com linhas, filtro de tag no cabeçalho
 * (`?tag=`) e ordem (`?ordem=`). Sem filtro, abre com o destaque da semana.
 */
export default async function CommunityPage({
  searchParams,
}: PageProps<"/comunidade">) {
  const query = await searchParams;
  const order = parseFeedOrder(readParam(query.ordem));
  const { tags, activeTag, posts, totalPosts, highlight, unanswered, teasers } =
    await getFeed(readParam(query.tag), order);
  const isJustPublished = readParam(query.publicado) === "1";
  const activeSlug = activeTag?.slug ?? null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Comunidade"
        eyebrow="Dúvidas e discussões da turma"
        subtitle="Pergunte o que travou, mostre o prompt que funcionou, aprenda com quem está um passo à frente."
        tone="comunidade"
        actions={
          <ActionLink href="/comunidade/novo" className="hidden lg:flex">
            <PenLine aria-hidden strokeWidth={2} />
            Escrever post
          </ActionLink>
        }
      >
        <UnderlineTabs
          id="tags-feed"
          label="Filtrar por tag"
          tabs={[
            {
              label: "Todas",
              href: buildFeedHref(null, order),
              isActive: activeSlug === null,
              count: totalPosts,
            },
            ...tags.map((tag) => ({
              label: tag.label,
              href: buildFeedHref(tag.slug, order),
              isActive: activeSlug === tag.slug,
              count: tag.postsCount,
            })),
          ]}
          className="-mb-5 lg:-mb-6"
        />
      </PageHeader>

      <main className="flex flex-col gap-8 pt-6 pb-28 lg:pt-8 lg:pb-0 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-12">
        <div className="flex min-w-0 flex-col gap-8">
          {isJustPublished ? (
            <p
              role="status"
              className="mx-4 flex items-start gap-3 border-b border-linha pb-4 text-sm leading-relaxed lg:mx-0"
            >
              <CircleCheck
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-acao"
                strokeWidth={2}
              />
              Post publicado. Neste protótipo ele não fica salvo, mas passou
              pela validação.
            </p>
          ) : null}

          {highlight && order === "recentes" ? (
            <WeekHighlight highlight={highlight} />
          ) : null}

          <section aria-labelledby="posts" className="flex flex-col">
            <div className="mx-4 flex flex-wrap items-end justify-between gap-x-6 border-b border-linha lg:mx-0">
              <h2
                id="posts"
                className="flex min-h-11 items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-[2px] bg-comunidade"
                />
                {activeTag ? (
                  <Link
                    href={`/comunidade/tags/${activeTag.slug}`}
                    className="underline-offset-4 outline-none hover:underline focus-visible:underline"
                  >
                    #{activeTag.slug}
                  </Link>
                ) : (
                  "Todos os posts"
                )}
                <span className="font-mono font-normal tracking-normal text-texto-secundario normal-case">
                  {formatPostsCount(posts.length)}
                </span>
              </h2>
              <UnderlineTabs
                id="ordem-feed"
                label="Ordenar posts"
                tabs={(Object.keys(orderLabels) as FeedOrder[]).map(
                  (option) => ({
                    label: orderLabels[option],
                    href: buildFeedHref(activeSlug, option),
                    isActive: option === order,
                  }),
                )}
                className="mx-0 px-0 [&_ul]:gap-4"
              />
            </div>
            <PostList
              posts={posts}
              emptyMessage={
                order === "sem-resposta"
                  ? "Toda pergunta daqui já recebeu resposta."
                  : "Ainda não há posts com esta tag."
              }
            />
          </section>
        </div>

        <aside
          aria-label="Atalhos da comunidade"
          className="hidden flex-col gap-10 xl:sticky xl:top-8 xl:flex"
        >
          <section aria-labelledby="salvos" className="flex flex-col">
            <SectionHeading id="salvos" title="Salvos" tone="comunidade" />
            <SavedPosts posts={teasers} />
          </section>

          {unanswered.length > 0 ? (
            <section aria-labelledby="sem-resposta" className="flex flex-col">
              <SectionHeading
                id="sem-resposta"
                title="Esperando resposta"
                tone="acao"
                meta={`${unanswered.length}`}
              />
              <ul className="divide-y divide-linha">
                {unanswered.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/comunidade/posts/${post.id}`}
                      className="flex flex-col gap-1 rounded-sm py-3 outline-none focus-visible:ring-2 focus-visible:ring-texto"
                    >
                      <span className="text-[15px] leading-snug font-medium hover:underline hover:underline-offset-4">
                        {post.title}
                      </span>
                      <span className="font-mono text-[11px] text-texto-secundario">
                        {post.author.name} · {post.timeAgo}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="tags-seguidas" className="flex flex-col">
            <SectionHeading id="tags-seguidas" title="Tags" tone="comunidade" />
            <ul className="divide-y divide-linha">
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={`/comunidade/tags/${tag.slug}`}
                    className="group/tag flex min-h-11 items-center justify-between gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-texto"
                  >
                    <span className="font-mono text-[13px] group-hover/tag:underline group-hover/tag:underline-offset-4">
                      #{tag.slug}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-texto-secundario">
                      {formatNumber(tag.followers)} seguem
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>

      {/* Celular: ação principal fixa acima da barra inferior. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 mx-auto flex max-w-[480px] justify-end px-4 lg:hidden">
        <ActionLink
          href="/comunidade/novo"
          className="pointer-events-auto ring-4 ring-fundo"
        >
          <PenLine aria-hidden strokeWidth={2} />
          Escrever post
        </ActionLink>
      </div>
    </div>
  );
}
