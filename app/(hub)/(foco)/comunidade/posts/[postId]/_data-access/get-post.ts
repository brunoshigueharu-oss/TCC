import "server-only";

import { findPost, type PostDetail } from "@/lib/data/comunidade";

/**
 * Um post com as respostas. No protótipo lê dados fictícios; na versão real
 * chama o módulo "Comunidades" da API. Devolve `null` se o post não existe.
 */
export async function getPost(postId: string): Promise<PostDetail | null> {
  return findPost(postId);
}
