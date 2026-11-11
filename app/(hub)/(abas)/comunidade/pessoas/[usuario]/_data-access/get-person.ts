import "server-only";

import {
  listAnswersByAuthor,
  listPostsByAuthor,
  type PersonAnswer,
  type PostSummary,
} from "@/lib/data/comunidade";
import { CURRENT_USERNAME, findPerson, type Person } from "@/lib/data/pessoas";

export type PublicProfile = {
  person: Person;
  /** O perfil aberto é o da própria pessoa logada. */
  isCurrentUser: boolean;
  posts: PostSummary[];
  answers: PersonAnswer[];
};

/**
 * Busca o perfil público pelo `@usuario`, com os posts e as respostas da
 * pessoa na Comunidade. Devolve `null` quando a pessoa não existe (404).
 */
export async function getPerson(
  username: string,
): Promise<PublicProfile | null> {
  const person = findPerson(username);
  if (!person) return null;
  return {
    person,
    isCurrentUser: person.username === CURRENT_USERNAME,
    posts: listPostsByAuthor(person.username),
    answers: listAnswersByAuthor(person.username),
  };
}
