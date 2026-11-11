import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { PersonCourse } from "@/lib/data/pessoas";

type PersonCoursesProps = {
  courses: PersonCourse[];
};

/** Minicursos que a pessoa publicou em Cursos da comunidade. */
export function PersonCourses({ courses }: PersonCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <section aria-labelledby="cursos-pessoa" className="flex flex-col">
      <SectionHeading id="cursos-pessoa" title="Minicursos" tone="comunidade" />
      <ul className="mx-4 divide-y divide-linha lg:mx-0">
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/educacao/cursos/${course.id}`}
              className="flex flex-col gap-1 rounded-sm py-3 outline-none focus-visible:ring-2 focus-visible:ring-texto"
            >
              <span className="text-[15px] font-medium hover:underline hover:underline-offset-4">
                {course.title}
              </span>
              <span className="font-mono text-[11px] text-texto-secundario">
                {course.lessons} aulas · {course.students} inscritos
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
