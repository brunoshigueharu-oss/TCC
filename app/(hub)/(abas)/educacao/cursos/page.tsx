import { ArrowUpRight, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { courseTagLabels } from "@/lib/data/cursos";
import { formatTwoDigits } from "@/lib/format";
import { EducationTabs } from "../_components/education-tabs";
import { FilterBar } from "../_components/filter-bar";
import { CourseRow, FeaturedCourse } from "./_components/course-card";
import { getCourses, getCourseTags, parseCourseTag } from "./_data-access/get-courses";

export const metadata: Metadata = { title: "Cursos da comunidade" };

/** Cursos da comunidade (Figma: "Cursos da comunidade"). O filtro fica em `?tag=`. */
export default async function CoursesPage({ searchParams }: PageProps<"/educacao/cursos">) {
  const activeTag = parseCourseTag((await searchParams).tag);
  const [allCourses, courses, tags] = await Promise.all([getCourses(null), getCourses(activeTag), getCourseTags()]);

  // Número fixo de cada curso na "estante", independente do filtro.
  const numberOf = (courseId: string) => allCourses.findIndex((course) => course.id === courseId) + 1;
  const featured = activeTag === null ? allCourses.find((course) => course.completedLessons > 0) : undefined;
  const listed = featured ? courses.filter((course) => course.id !== featured.id) : courses;

  const filterOptions = [
    { id: "todos", label: "Todos", href: "/educacao/cursos", count: allCourses.length },
    ...tags.map((tag) => ({
      id: tag,
      label: courseTagLabels[tag],
      href: `/educacao/cursos?tag=${tag}`,
      count: allCourses.filter((course) => course.tags.includes(tag)).length,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Cursos da comunidade"
        subtitle="Minicursos gratuitos criados por designers da comunidade."
        tone="comunidade"
        eyebrow="Educação"
      >
        <EducationTabs active="cursos" />
      </PageHeader>

      <main className="flex flex-col gap-10 pt-8 pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-x-16 lg:pt-12 lg:pb-0">
        <div className="flex min-w-0 flex-col gap-10">
          {featured ? (
            <div className="px-4 lg:px-0">
              <FeaturedCourse course={featured} number={numberOf(featured.id)} />
            </div>
          ) : null}

          <section aria-labelledby="minicursos" className="flex flex-col gap-4 px-4 lg:px-0">
            <h2
              id="minicursos"
              className="flex min-h-11 items-center justify-between gap-3 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
                {activeTag ? courseTagLabels[activeTag] : "Estante"}
              </span>
              <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
                {formatTwoDigits(courses.length)} minicursos
              </span>
            </h2>
            <FilterBar label="Filtrar por tag" options={filterOptions} activeId={activeTag ?? "todos"} />
            {listed.length > 0 ? (
              <ol className="border-t border-linha">
                {listed.map((course) => (
                  <li key={course.id}>
                    <CourseRow course={course} number={numberOf(course.id)} />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="border-t border-linha py-6 text-sm text-texto-secundario">
                Ainda não há minicursos com esta tag.
              </p>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-10 px-4 lg:sticky lg:top-8 lg:px-0">
          <form action="/busca" method="get" role="search" className="relative">
            <input type="hidden" name="tipo" value="cursos" />
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-texto-secundario"
              strokeWidth={1.75}
            />
            <input
              type="search"
              name="q"
              aria-label="Buscar cursos"
              placeholder="Buscar minicursos"
              className="h-11 w-full border-b border-linha bg-transparent pr-2 pl-7 text-[15px] outline-none transition-colors placeholder:text-texto-secundario focus-visible:border-texto"
            />
          </form>

          <section aria-labelledby="compartilhe" className="flex flex-col gap-3 border-t border-texto pt-4">
            <h2 id="compartilhe" className="font-display text-xl leading-tight font-medium tracking-[-0.025em]">
              Compartilhe o que você sabe
            </h2>
            <p className="text-sm leading-relaxed text-texto-secundario">
              Monte um minicurso no computador. Ele passa pela moderação antes de aparecer na estante.
            </p>
            <Link
              href="/criar-minicurso"
              className="group flex min-h-11 items-center gap-2 self-start text-sm font-semibold underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:ring-2 focus-visible:ring-texto"
            >
              Criar minicurso
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </section>
        </aside>
      </main>
    </>
  );
}
