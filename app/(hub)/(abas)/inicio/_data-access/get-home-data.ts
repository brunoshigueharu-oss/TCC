import "server-only";

import { homeData, type HomeData } from "@/lib/data/home";
import { profile } from "@/lib/data/perfil";
import { findCurrentLesson, getModuleProgress, track, type Lesson, type LessonStatus } from "@/lib/data/trilha";

/** Quantas lições seguintes aparecem em "A seguir", depois da atual. */
const UPCOMING_LESSONS_LIMIT = 3;

export type CurrentLessonSummary = {
  moduleNumber: number;
  moduleTitle: string;
  lesson: Lesson;
  completedLessons: number;
  lessonsTotal: number;
  /** Estado de cada lição do módulo, na ordem (vira o progresso em segmentos). */
  lessonStates: LessonStatus[];
  /** Próximas lições do mesmo módulo, ainda bloqueadas. */
  upcomingLessons: Lesson[];
  /** Lições que faltam no módulo, contando a atual. */
  remainingLessons: number;
  /** Duração média das lições que faltam, em minutos. */
  averageMinutes: number;
};

/** Números da semana que alimentam a faixa de estatísticas e o resumo. */
export type WeekOverview = {
  xp: number;
  /** Dias com estudo, entre os dias que já passaram. */
  activeDays: number;
  elapsedDays: number;
  /** Dia de maior XP, por extenso (ex.: "quinta"). `null` se a semana está vazia. */
  bestDay: { name: string; xp: number } | null;
  /** Dias já passados sem estudo, por extenso. */
  missedDays: string[];
  streakDays: number;
  studyMinutes: number;
  answersGiven: number;
};

export type HomePageData = HomeData & {
  currentLesson: CurrentLessonSummary | null;
  week: WeekOverview;
};

const dayNames: Record<string, string> = {
  Seg: "segunda",
  Ter: "terça",
  Qua: "quarta",
  Qui: "quinta",
  Sex: "sexta",
  Sáb: "sábado",
  Dom: "domingo",
};

function getWeekOverview(): WeekOverview {
  const elapsed = profile.week.filter((day) => !day.isFuture);
  const best = elapsed.reduce<(typeof elapsed)[number] | null>(
    (top, day) => (day.xp > (top?.xp ?? 0) ? day : top),
    null,
  );

  return {
    xp: elapsed.reduce((sum, day) => sum + day.xp, 0),
    activeDays: elapsed.filter((day) => day.xp > 0).length,
    elapsedDays: elapsed.length,
    bestDay: best ? { name: dayNames[best.label] ?? best.label, xp: best.xp } : null,
    missedDays: elapsed.filter((day) => day.xp === 0).map((day) => dayNames[day.label] ?? day.label),
    streakDays: profile.streakDays,
    studyMinutes: homeData.studyMinutes,
    answersGiven: homeData.answersGiven,
  };
}

/**
 * Busca os dados da Home. No protótipo junta dados fictícios; na versão real
 * esta função chama a API com o usuário da sessão.
 */
export async function getHomeData(): Promise<HomePageData> {
  const current = findCurrentLesson(track);
  const week = getWeekOverview();

  if (!current) return { ...homeData, currentLesson: null, week };

  const { trackModule, lesson } = current;
  const progress = getModuleProgress(trackModule);
  const currentIndex = trackModule.lessons.indexOf(lesson);
  const remaining = trackModule.lessons.slice(currentIndex);

  return {
    ...homeData,
    week,
    currentLesson: {
      moduleNumber: trackModule.number,
      moduleTitle: trackModule.title,
      lesson,
      completedLessons: progress.completed,
      lessonsTotal: progress.total,
      lessonStates: trackModule.lessons.map((item) => item.status),
      upcomingLessons: trackModule.lessons.slice(currentIndex + 1, currentIndex + 1 + UPCOMING_LESSONS_LIMIT),
      remainingLessons: remaining.length,
      averageMinutes: Math.round(remaining.reduce((sum, item) => sum + item.minutes, 0) / remaining.length),
    },
  };
}
