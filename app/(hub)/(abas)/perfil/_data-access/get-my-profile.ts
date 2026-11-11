import "server-only";

import { countUnreadNotifications } from "@/lib/data/notificacoes";
import { CURRENT_USERNAME, findPerson, type Person } from "@/lib/data/pessoas";
import { profile, type Profile } from "@/lib/data/perfil";
import { findCurrentLesson, getModuleProgress, track, type LessonStatus } from "@/lib/data/trilha";
import { getRanking } from "./get-ranking";

export type TrackSummary = {
  moduleNumber: number;
  moduleTitle: string;
  completed: number;
  total: number;
  xpEarned: number;
  xpTotal: number;
  currentLessonId: string | null;
  lessons: { id: string; number: number; title: string; status: LessonStatus; minutes: number }[];
};

/** Números do mapa de consistência (últimas 26 semanas). */
export type ConsistencySummary = {
  activeDays: number;
  totalLessons: number;
  longestStreakDays: number;
};

export type MyProfileData = {
  person: Person;
  profile: Profile;
  track: TrackSummary;
  consistency: ConsistencySummary;
  weeklyRank: number;
  unreadNotifications: number;
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
  const activityDays = profile.activity.flat();

  return {
    person,
    profile,
    track: {
      moduleNumber: trackModule.number,
      moduleTitle: trackModule.title,
      completed: progress.completed,
      total: progress.total,
      xpEarned: progress.xpEarned,
      xpTotal: progress.xpTotal,
      currentLessonId: current?.lesson.id ?? null,
      lessons: trackModule.lessons.map(({ id, number, title, status, minutes }) => ({
        id,
        number,
        title,
        status,
        minutes,
      })),
    },
    consistency: {
      activeDays: activityDays.filter((day) => day.xp > 0).length,
      totalLessons: activityDays.reduce((sum, day) => sum + day.lessons, 0),
      longestStreakDays: profile.longestStreakDays,
    },
    weeklyRank: myEntry?.position ?? ranking.length,
    unreadNotifications: countUnreadNotifications(),
  };
}
