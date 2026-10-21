import "server-only";

import { CURRENT_USERNAME, findPerson } from "@/lib/data/pessoas";
import { defaultPreferences, profile, type AccountInput, type Preferences } from "@/lib/data/perfil";

export type SettingsData = {
  account: AccountInput;
  preferences: Preferences;
};

/** Dados da conta e preferências da pessoa logada (fictícios no protótipo). */
export async function getSettings(): Promise<SettingsData> {
  const person = findPerson(CURRENT_USERNAME);
  if (!person) throw new Error("Pessoa logada não encontrada nos dados do protótipo.");

  return {
    account: { name: person.name, email: profile.email, role: person.role },
    preferences: defaultPreferences,
  };
}
