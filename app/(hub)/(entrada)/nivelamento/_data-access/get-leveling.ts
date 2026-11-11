import "server-only";

import { entradaData, type LevelingQuestion, type LevelingResult } from "@/lib/data/entrada";

export type LevelingData = {
  questions: LevelingQuestion[];
  results: LevelingResult[];
};

/** Perguntas do nivelamento, na ordem, e os pontos de partida possíveis. */
export async function getLeveling(): Promise<LevelingData> {
  return { questions: entradaData.levelingQuestions, results: entradaData.levelingResults };
}
