import "server-only";

import {
  findPost,
  getCurrentPerson,
  listRelatedPosts,
  type Person,
  type PostDetail,
  type PostSummary,
} from "@/lib/data/comunidade";

export type PostPageData = {
  post: PostDetail;
  related: PostSummary[];
  currentPerson: Person;
};

/**
 * Um post com as respostas e as dúvidas parecidas. No protótipo lê dados
 * fictícios; na versão real chama o módulo "Comunidades" da API. Devolve
 * `null` se o post não existe.
 */
export async function getPost(postId: string): Promise<PostPageData | null> {
  const post = findPost(postId);
  if (!post) return null;
  return { post, related: listRelatedPosts(post.id), currentPerson: getCurrentPerson() };
}
