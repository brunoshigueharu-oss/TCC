import "server-only";

import { z } from "zod";

import { normalizeSearchText, searchIndex } from "@/lib/data/busca";
import { courses, formatDuration, formatLessonsCount, getCourseMinutes } from "@/lib/data/cursos";
import { track } from "@/lib/data/trilha";
import { formatAnswers, formatTwoDigits } from "@/lib/format";

/**
 * Busca do hub sobre os dados fictícios (lições, posts, minicursos e pessoas).
 * Na versão real vira uma chamada ao endpoint de busca da API.
 */

export const searchTypeSchema = z.enum(["tudo", "licoes", "posts", "cursos", "pessoas"]);
export type SearchType = z.infer<typeof searchTypeSchema>;
export type SearchResultKind = Exclude<SearchType, "tudo">;

export type SearchResult = {
  kind: SearchResultKind;
  id: string;
  title: string;
  meta: string;
  href: string;
};

/** Mais curto que isso não busca (evita listar tudo com uma letra). */
const MIN_QUERY_LENGTH = 2;

function matches(query: string, fields: string[]) {
  return fields.some((field) => normalizeSearchText(field).includes(query));
}

/** Lê `?tipo=`; qualquer valor desconhecido vira "tudo". */
export function parseSearchType(raw: string | string[] | undefined): SearchType {
  const parsed = searchTypeSchema.safeParse(Array.isArray(raw) ? raw[0] : raw);
  return parsed.success ? parsed.data : "tudo";
}

export function parseSearchQuery(raw: string | string[] | undefined) {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 80) ?? "";
}

export async function searchHub(rawQuery: string) {
  const query = normalizeSearchText(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return null;

  const lessons: SearchResult[] = track.modules.flatMap((trackModule) =>
    trackModule.lessons
      .filter((lesson) => matches(query, [lesson.title]))
      .map((lesson) => ({
        kind: "licoes" as const,
        id: lesson.id,
        title: lesson.title,
        meta: `Módulo ${formatTwoDigits(trackModule.number)} · Lição ${formatTwoDigits(lesson.number)} · ${lesson.minutes} min`,
        href: `/educacao/licao/${lesson.id}`,
      })),
  );

  const posts: SearchResult[] = searchIndex.posts
    .filter((post) => matches(query, [post.title, ...post.keywords]))
    .map((post) => ({
      kind: "posts" as const,
      id: post.id,
      title: post.title,
      meta: `Post · ${post.context} · ${formatAnswers(post.answers)}`,
      href: `/comunidade/posts/${post.id}`,
    }));

  const courseResults: SearchResult[] = courses
    .filter((course) =>
      matches(query, [
        course.title,
        course.description,
        course.author.name,
        ...course.tags,
        ...course.lessons.map((lesson) => lesson.title),
      ]),
    )
    .map((course) => ({
      kind: "cursos" as const,
      id: course.id,
      title: course.title,
      meta: `por ${course.author.name} · ${formatLessonsCount(course.lessons.length)} · ${formatDuration(getCourseMinutes(course))}`,
      href: `/educacao/cursos/${course.id}`,
    }));

  const people: SearchResult[] = searchIndex.people
    .filter((person) => matches(query, [person.name, person.username, person.role]))
    .map((person) => ({
      kind: "pessoas" as const,
      id: person.username,
      title: person.name,
      meta: `@${person.username} · ${person.role} · Nível ${formatTwoDigits(person.level)}`,
      href: `/comunidade/pessoas/${person.username}`,
    }));

  return {
    results: { licoes: lessons, posts, cursos: courseResults, pessoas: people },
    tags: searchIndex.tags.filter((tag) => normalizeSearchText(tag).includes(query) || query.includes(tag)),
  };
}

export async function getSearchSuggestions() {
  return searchIndex.suggestions;
}
