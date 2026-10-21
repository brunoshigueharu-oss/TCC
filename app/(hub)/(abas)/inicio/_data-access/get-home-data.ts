import "server-only";

import { homeData, type HomeData } from "@/lib/data/home";
import { findCurrentLesson, getModuleProgress, track, type Lesson } from "@/lib/data/trilha";

/** Quantas lições seguintes aparecem no carrossel, depois da atual. */
const UPCOMING_LESSONS_LIMIT = 2;

export type CurrentLessonSummary = {
  moduleNumber: number;
  lesson: Lesson;
  completedLessons: number;
  lessonsTotal: number;
  /** Próximas lições do mesmo módulo, ainda bloqueadas. */
  upcomingLessons: Lesson[];
};

export type HomePageData = HomeData & {
  currentLesson: CurrentLessonSummary | null;
};

/**
 * Busca os dados da Home. No protótipo junta dados fictícios; na versão real
 * esta função chama a API com o usuário da sessão.
 */
export async function getHomeData(): Promise<HomePageData> {
  const current = findCurrentLesson(track);

  if (!current) return { ...homeData, currentLesson: null };

  const { trackModule, lesson } = current;
  const progress = getModuleProgress(trackModule);
  const currentIndex = trackModule.lessons.indexOf(lesson);

  return {
    ...homeData,
    currentLesson: {
      moduleNumber: trackModule.number,
      lesson,
      completedLessons: progress.completed,
      lessonsTotal: progress.total,
      upcomingLessons: trackModule.lessons.slice(
        currentIndex + 1,
        currentIndex + 1 + UPCOMING_LESSONS_LIMIT,
      ),
    },
  };
}
