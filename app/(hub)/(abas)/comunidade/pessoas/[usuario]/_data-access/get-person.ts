import "server-only";

import { CURRENT_USERNAME, findPerson, type Person } from "@/lib/data/pessoas";

export type PublicProfile = {
  person: Person;
  /** O perfil aberto é o da própria pessoa logada. */
  isCurrentUser: boolean;
};

/**
 * Busca o perfil público pelo `@usuario`. Devolve `null` quando a pessoa não
 * existe (a página responde com 404).
 */
export async function getPerson(username: string): Promise<PublicProfile | null> {
  const person = findPerson(username);
  if (!person) return null;
  return { person, isCurrentUser: person.username === CURRENT_USERNAME };
}
