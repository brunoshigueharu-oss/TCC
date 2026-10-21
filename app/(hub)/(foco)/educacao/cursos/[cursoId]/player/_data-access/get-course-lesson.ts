import "server-only";

import { courses } from "@/lib/data/cursos";

/**
 * Leitura do player: o minicurso e a aula pedida em `?aula=N`. Na versão
 * real chama o módulo "Cursos da comunidade" da API.
 */

/** Lê `?aula=N` e mantém o número dentro das aulas do curso. */
export function parseLessonNumber(raw: string | string[] | undefined, total: number) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, total);
}

export async function getCourseForPlayer(courseId: string) {
  return courses.find((course) => course.id === courseId) ?? null;
}
