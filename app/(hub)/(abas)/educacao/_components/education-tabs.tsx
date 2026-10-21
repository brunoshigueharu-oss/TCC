import { Chip } from "@/components/chip";

export type EducationArea = "trilha" | "praticar" | "cursos" | "proficiencia";

const areas: { id: EducationArea; label: string; href: string }[] = [
  { id: "trilha", label: "Trilha", href: "/educacao" },
  { id: "praticar", label: "Praticar", href: "/educacao/praticar" },
  { id: "cursos", label: "Cursos", href: "/educacao/cursos" },
  { id: "proficiencia", label: "Proficiência", href: "/educacao/proficiencia" },
];

type EducationTabsProps = {
  active: EducationArea;
};

/** As quatro áreas da aba Educação, em chips roláveis. Vai dentro do PageHeader. */
export function EducationTabs({ active }: EducationTabsProps) {
  return (
    <nav aria-label="Áreas da Educação" className="-mx-4">
      <ul className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {areas.map((area) => (
          <li key={area.id}>
            <Chip href={area.href} isActive={area.id === active}>
              {area.label}
            </Chip>
          </li>
        ))}
      </ul>
    </nav>
  );
}
