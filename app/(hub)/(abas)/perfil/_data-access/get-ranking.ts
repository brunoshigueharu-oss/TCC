import "server-only";

import { CURRENT_USERNAME, people, type AvatarTone } from "@/lib/data/pessoas";

export type RankingPeriod = "semana" | "mes";

export type RankingEntry = {
  position: number;
  username: string;
  name: string;
  level: number;
  avatarTone: AvatarTone;
  xp: number;
  isCurrentUser: boolean;
};

/** Lê `?periodo=` — qualquer valor diferente de "mes" vira "semana". */
export function parseRankingPeriod(raw: string | string[] | undefined): RankingPeriod {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "mes" ? "mes" : "semana";
}

/** Ranking de amigos pelo XP ganho no período, do maior para o menor. */
export async function getRanking(period: RankingPeriod): Promise<RankingEntry[]> {
  return people
    .map((person) => ({
      username: person.username,
      name: person.name,
      level: person.level,
      avatarTone: person.avatarTone,
      xp: period === "mes" ? person.monthlyXp : person.weeklyXp,
      isCurrentUser: person.username === CURRENT_USERNAME,
    }))
    .sort((first, second) => second.xp - first.xp)
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}
