"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";

import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

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

/**
 * As quatro áreas da Educação como abas de texto, com número em mono e um
 * fio que desliza até a aba ativa. Vai dentro do PageHeader.
 */
export function EducationTabs({ active }: EducationTabsProps) {
  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label="Áreas da Educação"
        className="-mx-4 -mb-5 lg:mx-0 lg:-mb-6"
      >
        <ul className="flex gap-6 overflow-x-auto px-4 [scrollbar-width:none] lg:gap-8 lg:px-0 [&::-webkit-scrollbar]:hidden">
          {areas.map((area, index) => {
            const isActive = area.id === active;
            return (
              <li key={area.id} className="relative shrink-0">
                <Link
                  href={area.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex h-12 items-center gap-2 text-[15px] font-medium outline-none transition-colors focus-visible:underline",
                    isActive
                      ? "text-texto"
                      : "text-texto-secundario hover:text-texto",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums transition-colors",
                      isActive
                        ? "text-texto"
                        : "text-desativado group-hover:text-texto-secundario",
                    )}
                  >
                    {formatTwoDigits(index + 1)}
                  </span>
                  {area.label}
                </Link>
                {isActive ? (
                  <motion.span
                    layoutId="educacao-aba-ativa"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-texto"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
