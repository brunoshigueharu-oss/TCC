import "server-only";

import { listPosts, listTagsWithCount } from "@/lib/data/comunidade";
import { normalizeSearchText, searchIndex } from "@/lib/data/busca";
import { courses, formatDuration, formatLessonsCount, getCourseMinutes } from "@/lib/data/cursos";
import { track } from "@/lib/data/trilha";
import { formatAnswers, formatTwoDigits } from "@/lib/format";
import type { SearchData, SearchItem } from "../_lib/search-types";

/**
 * Índice da Busca sobre os dados fictícios (lições, minicursos, posts e
 * pessoas). É pequeno, então vai inteiro para o navegador e a busca acontece
 * a cada tecla, sem ida ao servidor. Na versão real vira um endpoint de busca
 * da API, chamado com o termo.
 */
export async function getSearchData(): Promise<SearchData> {
  const lessons: SearchItem[] = track.modules.flatMap((trackModule) =>
    trackModule.lessons.map((lesson) => ({
      kind: "licoes" as const,
      id: lesson.id,
      title: lesson.title,
      meta: `Módulo ${formatTwoDigits(trackModule.number)} · Lição ${formatTwoDigits(lesson.number)} · ${lesson.minutes} min`,
      href: `/educacao/licao/${lesson.id}`,
      haystack: normalizeSearchText(lesson.title),
    })),
  );

  const courseItems: SearchItem[] = courses.map((course) => ({
    kind: "cursos" as const,
    id: course.id,
    title: course.title,
    meta: `${course.author.name} · ${formatLessonsCount(course.lessons.length)} · ${formatDuration(getCourseMinutes(course))}`,
    href: `/educacao/cursos/${course.id}`,
    haystack: normalizeSearchText(
      [course.title, course.description, course.author.name, ...course.tags, ...course.lessons.map((lesson) => lesson.title)].join(" "),
    ),
  }));

  const posts: SearchItem[] = listPosts().map((post) => ({
    kind: "posts" as const,
    id: post.id,
    title: post.title,
    meta: `${post.isSolved ? "Resolvida" : formatAnswers(post.answersCount)} · ${post.author.name} · ${post.timeAgo}`,
    href: `/comunidade/posts/${post.id}`,
    haystack: normalizeSearchText([post.title, post.body, ...post.tags.map((tag) => tag.slug)].join(" ")),
  }));

  const people: SearchItem[] = searchIndex.people.map((person) => ({
    kind: "pessoas" as const,
    id: person.username,
    title: person.name,
    meta: `@${person.username} · ${person.role} · Nível ${formatTwoDigits(person.level)}`,
    href: `/comunidade/pessoas/${person.username}`,
    haystack: normalizeSearchText([person.name, person.username, person.role].join(" ")),
  }));

  return {
    items: [...lessons, ...courseItems, ...posts, ...people],
    suggestions: searchIndex.suggestions,
    tags: listTagsWithCount().map((tag) => ({ slug: tag.slug, postsCount: tag.postsCount })),
  };
}

export function parseSearchQuery(raw: string | string[] | undefined) {
  return (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 80) ?? "";
}
