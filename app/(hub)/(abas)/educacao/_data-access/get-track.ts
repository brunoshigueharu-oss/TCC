import "server-only";

import { playgroundScenario, type PlaygroundScenario } from "@/lib/data/playground";
import {
  findLesson,
  findModule,
  findNextLesson,
  glossary,
  track,
  type GlossaryEntry,
  type Track,
  type TrackModule,
} from "@/lib/data/trilha";

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

export async function getNextLesson(trackModule: TrackModule, lessonId: string) {
  return findNextLesson(trackModule, lessonId);
}

export async function getTrackModule(moduleId: string) {
  return findModule(track, moduleId);
}

export async function getGlossary(): Promise<GlossaryEntry[]> {
  return glossary;
}

export async function getPlaygroundScenario(): Promise<PlaygroundScenario> {
  return playgroundScenario;
}
