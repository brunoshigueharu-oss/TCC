import "server-only";

import { findLesson, findModule, track, type Track } from "@/lib/data/trilha";

/**
 * Leituras da trilha. No protótipo usam dados fictícios; na versão real chamam
 * o módulo "Trilha e lições" da API com o progresso da pessoa logada.
 */

export async function getTrack(): Promise<Track> {
  return track;
}

export async function getLesson(lessonId: string) {
  return findLesson(track, lessonId);
}

export async function getTrackModule(moduleId: string) {
  return findModule(track, moduleId);
}
