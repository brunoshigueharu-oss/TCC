import "server-only";

import { courses, courseTagSchema, type Course, type CourseTag } from "@/lib/data/cursos";

/**
 * Leituras dos minicursos da comunidade. No protótipo usam dados fictícios;
 * na versão real chamam o módulo "Cursos da comunidade" da API.
 */

/** Lê `?tag=` e devolve só tags conhecidas (qualquer outra vira "Todos"). */
export function parseCourseTag(raw: string | string[] | undefined): CourseTag | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = courseTagSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function getCourses(tag: CourseTag | null): Promise<Course[]> {
  return tag ? courses.filter((course) => course.tags.includes(tag)) : courses;
}

/** Tags que aparecem em pelo menos um curso, na ordem do cadastro. */
export async function getCourseTags(): Promise<CourseTag[]> {
  return courseTagSchema.options.filter((tag) => courses.some((course) => course.tags.includes(tag)));
}

export async function getCourse(courseId: string): Promise<Course | null> {
  return courses.find((course) => course.id === courseId) ?? null;
}
