import "server-only";

import {
  findTag,
  listPosts,
  listTags,
  sortByVotes,
  type CommunityTag,
  type PostSummary,
} from "@/lib/data/comunidade";

export type TagOrder = "recentes" | "uteis";

export type TagPageData = {
  tag: CommunityTag;
  posts: PostSummary[];
  solvedCount: number;
  otherTags: CommunityTag[];
};

/**
 * Página de uma tag. No protótipo lê dados fictícios; na versão real chama o
 * módulo "Comunidades" da API. Devolve `null` quando a tag não existe.
 */
export async function getTagPage(
  slug: string,
  order: TagOrder,
): Promise<TagPageData | null> {
  const tag = findTag(slug);
  if (!tag) return null;
  const posts = listPosts(tag.slug);
  return {
    tag,
    posts: order === "uteis" ? sortByVotes(posts) : posts,
    solvedCount: posts.filter((post) => post.isSolved).length,
    otherTags: listTags().filter((other) => other.slug !== tag.slug),
  };
}
