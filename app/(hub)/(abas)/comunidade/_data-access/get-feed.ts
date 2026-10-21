import "server-only";

import { findTag, listPosts, listTags, type CommunityTag, type PostSummary } from "@/lib/data/comunidade";

export type FeedData = {
  tags: CommunityTag[];
  /** Tag do filtro; `null` quando o feed mostra todas (ou a tag não existe). */
  activeTag: CommunityTag | null;
  posts: PostSummary[];
};

/**
 * Feed da Comunidade. No protótipo lê dados fictícios; na versão real chama o
 * módulo "Comunidades" da API com as tags que a pessoa segue.
 */
export async function getFeed(tagSlug: string | undefined): Promise<FeedData> {
  const activeTag = tagSlug ? findTag(tagSlug) : null;
  return {
    tags: listTags(),
    activeTag,
    posts: listPosts(activeTag?.slug),
  };
}
