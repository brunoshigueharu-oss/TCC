import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { PostList } from "../../_components/post-list";
import { TagLink } from "../../_components/tag-link";
import { UnderlineTabs } from "../../_components/underline-tabs";
import { TagIntro } from "./_components/tag-intro";
import { getTagPage, type TagOrder } from "./_data-access/get-tag-page";

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

function buildTagHref(slug: string, order: TagOrder) {
  return order === "uteis"
    ? `/comunidade/tags/${slug}?ordem=uteis`
    : `/comunidade/tags/${slug}`;
}

export async function generateMetadata({
  params,
}: PageProps<"/comunidade/tags/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

/** Página da tag: cabeçalho tipográfico, ordem na URL (`?ordem=`), lista em linhas. */
export default async function TagPage({
  params,
  searchParams,
}: PageProps<"/comunidade/tags/[tag]">) {
  const { tag: slug } = await params;
  const order: TagOrder =
    readParam((await searchParams).ordem) === "uteis" ? "uteis" : "recentes";

  const data = await getTagPage(slug, order);
  if (!data) notFound();

  const { tag, posts, solvedCount, otherTags } = data;

  return (
    <div className="flex flex-1 flex-col">
      <BackBar href={`/comunidade?tag=${tag.slug}`} label="Comunidade" />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start xl:gap-12">
        <div className="flex min-w-0 flex-col">
          <TagIntro
            tag={tag}
            postsCount={posts.length}
            solvedCount={solvedCount}
          />
          <main className="flex flex-col pt-2 pb-10 lg:pb-0">
            <div className="mx-4 border-b border-linha lg:mx-0">
              <UnderlineTabs
                id="ordem-tag"
                label="Ordenar posts"
                tabs={[
                  {
                    label: "Recentes",
                    href: buildTagHref(tag.slug, "recentes"),
                    isActive: order === "recentes",
                  },
                  {
                    label: "Mais úteis",
                    href: buildTagHref(tag.slug, "uteis"),
                    isActive: order === "uteis",
                  },
                ]}
                className="mx-0 px-0"
              />
            </div>
            <section aria-label={`Posts com a tag ${tag.label}`}>
              <PostList
                posts={posts}
                emptyMessage="Ainda não há posts com esta tag."
              />
            </section>
          </main>
        </div>

        <aside
          aria-labelledby="outras-tags"
          className="flex flex-col px-4 pb-10 lg:px-0 xl:sticky xl:top-24 xl:pt-6"
        >
          <SectionHeading
            id="outras-tags"
            title="Outras tags"
            tone="comunidade"
            className="mx-0"
          />
          <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-3">
            {otherTags.map((other) => (
              <li key={other.slug}>
                <TagLink slug={other.slug} className="my-0 text-[13px]" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
