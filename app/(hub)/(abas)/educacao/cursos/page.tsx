import { GraduationCap, Search } from "lucide-react";
import type { Metadata } from "next";

import { ActionLink } from "@/components/action-link";
import { Chip } from "@/components/chip";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { courseTagLabels } from "@/lib/data/cursos";
import { EducationTabs } from "../_components/education-tabs";
import { CourseCard } from "./_components/course-card";
import { getCourses, getCourseTags, parseCourseTag } from "./_data-access/get-courses";

export const metadata: Metadata = { title: "Cursos da comunidade" };

/** Cursos da comunidade (Figma: "Cursos da comunidade"). O filtro fica em `?tag=`. */
export default async function CoursesPage({ searchParams }: PageProps<"/educacao/cursos">) {
  const activeTag = parseCourseTag((await searchParams).tag);
  const [courses, tags] = await Promise.all([getCourses(activeTag), getCourseTags()]);

  return (
    <>
      <PageHeader
        title="Cursos da comunidade"
        subtitle="Minicursos gratuitos criados por designers da comunidade."
        icon={GraduationCap}
        tone="comunidade"
      >
        <EducationTabs active="cursos" />
        <form action="/busca" method="get" role="search" className="relative">
          <input type="hidden" name="tipo" value="cursos" />
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-texto-secundario"
            strokeWidth={1.75}
          />
          <input
            type="search"
            name="q"
            aria-label="Buscar cursos"
            placeholder="Buscar cursos"
            className="h-11 w-full rounded-xl bg-superficie pr-4 pl-11 text-[15px] outline-none placeholder:text-texto-secundario focus-visible:ring-2 focus-visible:ring-texto"
          />
        </form>
      </PageHeader>

      <main className="flex flex-col gap-7 pt-6 pb-8 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8 lg:pb-0">
        <section aria-labelledby="minicursos" className="flex flex-col gap-2">
          <SectionHeading id="minicursos" title="Minicursos" icon={GraduationCap} tone="comunidade" />

          <nav aria-label="Filtrar por tag" className="pb-1">
            <ul className="flex gap-2 overflow-x-auto px-4 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:px-0">
              <li>
                <Chip href="/educacao/cursos" isActive={activeTag === null}>
                  Todos
                </Chip>
              </li>
              {tags.map((tag) => (
                <li key={tag}>
                  <Chip href={`/educacao/cursos?tag=${tag}`} isActive={tag === activeTag}>
                    {courseTagLabels[tag]}
                  </Chip>
                </li>
              ))}
            </ul>
          </nav>

          {/* Computador: a lista vira grade de cartões soltos. */}
          <SurfaceCard
            className={
              courses.length > 0
                ? "lg:overflow-visible lg:rounded-none lg:bg-transparent lg:ring-0"
                : undefined
            }
          >
            {courses.length > 0 ? (
              <ul className="divide-y divide-linha lg:grid lg:grid-cols-2 lg:gap-4 lg:divide-y-0">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="lg:overflow-hidden lg:rounded-2xl lg:bg-fundo lg:ring-1 lg:ring-linha/70"
                  >
                    <CourseCard course={course} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-sm text-texto-secundario">
                Ainda não há minicursos com esta tag.
              </p>
            )}
          </SurfaceCard>
        </section>

        <SurfaceCard className="flex flex-col gap-3 p-4 lg:sticky lg:top-8 lg:mt-[52px] lg:p-5">
          <p className="font-display text-lg leading-snug font-bold">Compartilhe o que você sabe</p>
          <p className="text-sm text-texto-secundario">
            Monte um minicurso no computador. Ele passa pela moderação antes de aparecer aqui.
          </p>
          <ActionLink href="/criar-minicurso" variant="secondary">
            Criar minicurso
          </ActionLink>
        </SurfaceCard>
      </main>
    </>
  );
}
