import "server-only";

import { CURRENT_USERNAME, findPerson, type Person } from "@/lib/data/pessoas";
import { profile, type Profile } from "@/lib/data/perfil";
import { findCurrentLesson, getModuleProgress, track } from "@/lib/data/trilha";
import { getRanking } from "./get-ranking";

export type TrackSummary = {
  moduleNumber: number;
  moduleTitle: string;
  completed: number;
  total: number;
  xpEarned: number;
  currentLessonId: string | null;
};

export type MyProfileData = {
  person: Person;
  profile: Profile;
  track: TrackSummary;
  weeklyRank: number;
};

/**
 * Busca os dados de Meu perfil. No protótipo junta dados fictícios; na versão
 * real chama a API com o usuário da sessão.
 */
export async function getMyProfile(): Promise<MyProfileData> {
  const person = findPerson(CURRENT_USERNAME);
  if (!person) throw new Error("Pessoa logada não encontrada nos dados do protótipo.");

  const current = findCurrentLesson(track);
  const trackModule = current?.trackModule ?? track.modules[0];
  const progress = getModuleProgress(trackModule);
  const ranking = await getRanking("semana");
  const myEntry = ranking.find((entry) => entry.isCurrentUser);

  return {
    person,
    profile,
    track: {
      moduleNumber: trackModule.number,
      moduleTitle: trackModule.title,
      completed: progress.completed,
      total: progress.total,
      xpEarned: progress.xpEarned,
      currentLessonId: current?.lesson.id ?? null,
    },
    weeklyRank: myEntry?.position ?? ranking.length,
  };
}
