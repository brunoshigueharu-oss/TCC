import { Award } from "lucide-react";
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
      <PageHeader title={proficiency.title} subtitle={proficiency.subtitle} icon={Award} tone="trilha">
        <EducationTabs active="proficiencia" />
      </PageHeader>
      <main className="flex flex-col gap-7 pt-6 pb-8">
        <p className="px-4 text-[15px] leading-relaxed">{proficiency.intro}</p>
        <TestDetails
          prerequisite={proficiency.prerequisite}
          totalMinutes={totalMinutes}
          totalQuestions={totalQuestions}
          passingPercent={proficiency.passingPercent}
        />
        <BadgeCard name={proficiency.badge.name} description={proficiency.badge.description} />
        <div className="flex flex-col gap-2 px-4">
          <p className="text-xs text-texto-secundario">
            O teste está liberado. A duração é uma referência: responda no seu ritmo.
          </p>
          <ActionLink href="/educacao/proficiencia/prova?questao=1">Iniciar teste</ActionLink>
        </div>
      </main>
    </>
  );
}
