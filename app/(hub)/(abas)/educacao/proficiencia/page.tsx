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
      {/* Computador: regras do teste à esquerda; selo e botão à direita. */}
      <main className="flex flex-col gap-7 pt-6 pb-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-x-8 lg:gap-y-6 lg:pb-0">
        <p className="px-4 text-[15px] leading-relaxed lg:col-span-2 lg:max-w-[720px] lg:px-0">{proficiency.intro}</p>
        <TestDetails
          prerequisite={proficiency.prerequisite}
          totalMinutes={totalMinutes}
          totalQuestions={totalQuestions}
          passingPercent={proficiency.passingPercent}
        />
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <BadgeCard name={proficiency.badge.name} description={proficiency.badge.description} />
          <div className="flex flex-col gap-2 px-4 lg:px-0">
            <p className="text-xs text-texto-secundario">
              O teste está liberado. A duração é uma referência: responda no seu ritmo.
            </p>
            <ActionLink href="/educacao/proficiencia/prova?questao=1">Iniciar teste</ActionLink>
          </div>
        </div>
      </main>
    </>
  );
}
