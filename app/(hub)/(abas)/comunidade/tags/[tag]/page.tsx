import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { PostList } from "../../_components/post-list";
import { OrderTabs } from "./_components/order-tabs";
import { TagIntro } from "./_components/tag-intro";
import { getTagPage, type TagOrder } from "./_data-access/get-tag-page";

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Monta a URL da tag mantendo os outros parâmetros (ordem e seguir). */
function buildTagHref(slug: string, order: TagOrder, isFollowing: boolean) {
  const params = new URLSearchParams();
  if (order === "uteis") params.set("ordem", "uteis");
  if (isFollowing) params.set("seguindo", "1");
  const query = params.toString();
  return query ? `/comunidade/tags/${slug}?${query}` : `/comunidade/tags/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/comunidade/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

/** Página da tag (Figma: "Página da tag"). Ordem e "seguir" ficam na URL. */
export default async function TagPage({
  params,
  searchParams,
}: PageProps<"/comunidade/tags/[tag]">) {
  const { tag: slug } = await params;
  const query = await searchParams;
  const order: TagOrder = readParam(query.ordem) === "uteis" ? "uteis" : "recentes";
  const isFollowing = readParam(query.seguindo) === "1";

  const data = await getTagPage(slug, order);
  if (!data) notFound();

  const { tag, posts } = data;

  return (
    <>
      <BackBar href={`/comunidade?tag=${tag.slug}`} label="Comunidade · Tags" />
      <main className="flex flex-col gap-5 pt-5 pb-8">
        <TagIntro
          tag={tag}
          postsCount={posts.length}
          isFollowing={isFollowing}
          toggleFollowHref={buildTagHref(tag.slug, order, !isFollowing)}
        />
        <OrderTabs
          options={[
            {
              label: "Recentes",
              href: buildTagHref(tag.slug, "recentes", isFollowing),
              isActive: order === "recentes",
            },
            {
              label: "Mais úteis",
              href: buildTagHref(tag.slug, "uteis", isFollowing),
              isActive: order === "uteis",
            },
          ]}
        />
        <section aria-label={`Posts com a tag ${tag.label}`}>
          <PostList posts={posts} emptyMessage="Ainda não há posts com esta tag." />
        </section>
      </main>
    </>
  );
}
