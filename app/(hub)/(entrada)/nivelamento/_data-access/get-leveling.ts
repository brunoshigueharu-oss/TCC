import "server-only";

import { entradaData, type LevelingQuestion } from "@/lib/data/entrada";

/** Perguntas do nivelamento, na ordem em que aparecem. */
export async function getLevelingQuestions(): Promise<LevelingQuestion[]> {
  return entradaData.levelingQuestions;
}
