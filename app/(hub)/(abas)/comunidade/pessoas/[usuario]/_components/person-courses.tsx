import { GraduationCap } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { PersonCourse } from "@/lib/data/pessoas";

type PersonCoursesProps = {
  courses: PersonCourse[];
};

/** Minicursos que a pessoa publicou em Cursos da comunidade. */
export function PersonCourses({ courses }: PersonCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <section aria-labelledby="cursos-pessoa" className="flex flex-col gap-2">
      <SectionHeading
        id="cursos-pessoa"
        title="Minicursos publicados"
        icon={GraduationCap}
        tone="comunidade"
      />
      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {courses.map((course) => (
            <li key={course.id}>
              <Link href={`/educacao/cursos/${course.id}`} className="flex flex-col gap-1 px-4 py-3">
                <span className="text-sm font-semibold">{course.title}</span>
                <span className="text-xs text-texto-secundario">
                  {course.lessons} aulas · {course.students} pessoas inscritas
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </section>
  );
}
