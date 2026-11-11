import type { GlossaryEntry, Lesson } from "@/lib/data/trilha";
import type { PlaygroundScenario } from "@/lib/data/playground";

/** Tudo o que o player da lição recebe do servidor (só dados serializáveis). */
export type LessonPlayerData = {
  lesson: Lesson;
  moduleId: string;
  moduleNumber: number;
  moduleLessonsCount: number;
  nextLesson: { id: string; number: number; title: string } | null;
  glossary: GlossaryEntry[];
  scenario: PlaygroundScenario;
};
