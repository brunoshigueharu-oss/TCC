import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { ActionLink } from "@/components/action-link";
import { PageHeader } from "@/components/page-header";
import { getProficiencySummary } from "@/lib/data/proficiencia";
import { EducationTabs } from "../_components/education-tabs";
import { BadgeCard } from "./_components/badge-card";
import { TestDetails } from "./_components/test-details";
import { getProficiency } from "./_data-access/get-proficiency";

export const metadata: Metadata = { title: "Teste de proficiência" };

/**
 * Teste de proficiência (Figma: "Teste de proficiência"). É também a prova
 * para pular módulos que a Trilha oferece.
 */
export default async function ProficiencyPage() {
  const proficiency = await getProficiency();
  const { totalQuestions, totalMinutes } = getProficiencySummary(proficiency);

  return (
    <>
      <PageHeader title={proficiency.title} subtitle={proficiency.subtitle} tone="trilha" eyebrow="Educação">
        <EducationTabs active="proficiencia" />
      </PageHeader>
      <main className="flex flex-col gap-12 px-4 pt-8 pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-x-16 lg:px-0 lg:pt-12 lg:pb-0">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <p className="max-w-[44ch] font-display text-[26px] leading-[1.2] font-medium tracking-[-0.025em] text-balance lg:text-[30px]">
              {proficiency.intro}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ActionLink href="/educacao/proficiencia/prova?questao=1">
                Iniciar teste
                <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </ActionLink>
              <p className="max-w-[32ch] text-xs leading-relaxed text-texto-secundario">
                O teste está liberado. A duração é uma referência: responda no seu ritmo.
              </p>
            </div>
          </div>
          <TestDetails
            prerequisite={proficiency.prerequisite}
            totalMinutes={totalMinutes}
            totalQuestions={totalQuestions}
            passingPercent={proficiency.passingPercent}
          />
        </div>
        <BadgeCard
          name={proficiency.badge.name}
          description={proficiency.badge.description}
          profileChanges={proficiency.profileChanges}
        />
      </main>
    </>
  );
}
