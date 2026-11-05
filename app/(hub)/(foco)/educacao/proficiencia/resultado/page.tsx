import { ListChecks, RotateCcw } from "lucide-react";
import type { Metadata } from "next";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { getDemoAnswers, parseAnswers, scoreAnswers } from "@/lib/data/proficiencia";
import { getProficiency } from "../_data-access/get-proficiency";
import { ResultShapes } from "./_components/result-shapes";
import { ScoreCard } from "./_components/score-card";

export const metadata: Metadata = { title: "Resultado do teste" };

/**
 * Resultado e selo (Figma: "Resultado e selo"). Corrige as respostas da URL
 * (`?respostas=`); sem respostas, mostra um resultado de demonstração.
 */
export default async function ProficiencyResultPage({
  searchParams,
}: PageProps<"/educacao/proficiencia/resultado">) {
  const proficiency = await getProficiency();
  const raw = (await searchParams).respostas;
  const answersParam = Array.isArray(raw) ? raw[0] : raw;
  const answers = answersParam
    ? parseAnswers(answersParam, proficiency.questions.length)
    : getDemoAnswers(proficiency);
  const score = scoreAnswers(proficiency, answers);

  return (
    <>
      <BackBar href="/educacao" label="Teste de proficiência" />
      <main className="flex flex-col gap-7 pt-5 pb-8 lg:gap-8 lg:px-8 lg:pt-8">
        <SurfaceCard as="section" aria-labelledby="titulo-resultado" className="flex flex-col items-center gap-2 px-4 pt-6 pb-5 text-center lg:px-8 lg:pt-10 lg:pb-8">
          <div className="flex h-28 w-48 items-end justify-center rounded-t-full bg-trilha/30">
            <ResultShapes isApproved={score.isApproved} className="size-24" />
          </div>
          <h1 id="titulo-resultado" className="mt-2 font-display text-[28px] leading-tight font-bold lg:text-[34px]">
            {score.isApproved ? "Você foi aprovado" : "Ainda não foi desta vez"}
          </h1>
          <p className="text-sm text-texto-secundario">
            {score.isApproved
              ? `${proficiency.badge.name} (nome provisório) conquistado.`
              : `O selo pede ${proficiency.passingPercent}% de acertos. Revise a trilha e tente de novo.`}
          </p>
        </SurfaceCard>

        <ScoreCard
          correct={score.correct}
          total={score.total}
          percent={score.percent}
          passingPercent={proficiency.passingPercent}
        />

        {score.isApproved ? (
          <section aria-labelledby="o-que-muda" className="flex flex-col gap-2">
            <SectionHeading id="o-que-muda" title="O que muda no seu perfil" icon={ListChecks} tone="trilha" />
            <SurfaceCard>
              <ul className="divide-y divide-linha">
                {proficiency.profileChanges.map((change) => (
                  <li key={change} className="px-4 py-3 text-sm leading-snug">
                    {change}
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </section>
        ) : null}

        <div className="flex flex-col gap-3 px-4 lg:flex-row-reverse lg:justify-start lg:px-0">
          {score.isApproved ? (
            <ActionLink href="/perfil" className="lg:w-56">Ver no perfil</ActionLink>
          ) : (
            <ActionLink href="/educacao/proficiencia/prova?questao=1" className="gap-2 lg:w-56">
              <RotateCcw aria-hidden className="size-4" strokeWidth={2.25} />
              Refazer teste
            </ActionLink>
          )}
          <ActionLink href="/educacao" variant="secondary" size="md" className="lg:w-56">
            Voltar à Educação
          </ActionLink>
        </div>
      </main>
    </>
  );
}
