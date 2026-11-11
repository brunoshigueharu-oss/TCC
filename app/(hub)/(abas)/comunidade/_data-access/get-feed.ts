import "server-only";

import {
  findTag,
  getWeekHighlight,
  listPosts,
  listPostTeasers,
  listTagsWithCount,
  sortByVotes,
  type CommunityTag,
  type PostSummary,
  type PostTeaser,
  type TagWithCount,
  type WeekHighlight,
} from "@/lib/data/comunidade";

export const feedOrders = ["recentes", "votados", "sem-resposta"] as const;
export type FeedOrder = (typeof feedOrders)[number];

export type FeedData = {
  tags: TagWithCount[];
  /** Tag do filtro; `null` quando o feed mostra todas (ou a tag não existe). */
  activeTag: CommunityTag | null;
  posts: PostSummary[];
  totalPosts: number;
  highlight: WeekHighlight | null;
  unanswered: PostSummary[];
  teasers: PostTeaser[];
};

export function parseFeedOrder(raw: string | undefined): FeedOrder {
  return feedOrders.find((order) => order === raw) ?? "recentes";
}

function applyOrder(posts: PostSummary[], order: FeedOrder) {
  if (order === "votados") return sortByVotes(posts);
  if (order === "sem-resposta")
    return posts.filter((post) => post.answersCount === 0);
  return posts;
}

/**
 * Feed da Comunidade. No protótipo lê dados fictícios; na versão real chama o
 * módulo "Comunidades" da API com as tags que a pessoa segue.
 */
export async function getFeed(
  tagSlug: string | undefined,
  order: FeedOrder,
): Promise<FeedData> {
  const activeTag = tagSlug ? findTag(tagSlug) : null;
  const all = listPosts();
  const filtered = listPosts(activeTag?.slug);

  return {
    tags: listTagsWithCount(),
    activeTag,
    posts: applyOrder(filtered, order),
    totalPosts: all.length,
    highlight: activeTag ? null : getWeekHighlight(),
    unanswered: all.filter((post) => post.answersCount === 0),
    teasers: listPostTeasers(),
  };
}
