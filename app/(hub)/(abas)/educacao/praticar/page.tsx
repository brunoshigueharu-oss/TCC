import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { activityKindLabel, activityKinds, type ActivityKind } from "@/lib/data/praticar";
import { formatTwoDigits } from "@/lib/format";
import { getPlaygroundScenario } from "../_data-access/get-track";
import { EducationTabs } from "../_components/education-tabs";
import { FilterBar } from "../_components/filter-bar";
import { PromptPlayground } from "../_components/prompt-playground/prompt-playground";
import { ActivityList } from "./_components/activity-list";
import { getPractice } from "./_data-access/get-practice";

export const metadata: Metadata = { title: "Praticar" };

/** Lê `?tipo=` e aceita só os tipos conhecidos. */
function parseKind(raw: string | string[] | undefined): ActivityKind | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return activityKinds.find((kind) => kind === value) ?? null;
}

/**
 * Área Praticar da Educação (Figma: "Praticar"): o laboratório de prompt no
 * topo e as atividades avaliadas abaixo. O filtro fica na URL.
 */
export default async function PracticePage({ searchParams }: PageProps<"/educacao/praticar">) {
  const [practice, scenario] = await Promise.all([getPractice(), getPlaygroundScenario()]);
  const activeKind = parseKind((await searchParams).tipo);
  const activities = activeKind
    ? practice.activities.filter((activity) => activity.kind === activeKind)
    : practice.activities;
  const numberOf = (activityId: string) =>
    practice.activities.findIndex((activity) => activity.id === activityId) + 1;

  const filterOptions = [
    { id: "todos", label: "Todas", href: "/educacao/praticar", count: practice.activities.length },
    ...activityKinds.map((kind) => ({
      id: kind,
      label: activityKindLabel[kind],
      href: `/educacao/praticar?tipo=${kind}`,
      count: practice.activities.filter((activity) => activity.kind === kind).length,
    })),
  ];

  return (
    <>
      <PageHeader title={practice.title} subtitle={practice.subtitle} tone="pratica" eyebrow="Educação">
        <EducationTabs active="praticar" />
      </PageHeader>
      <main className="flex flex-col gap-16 pt-8 pb-10 lg:gap-20 lg:pt-12 lg:pb-0">
        <section aria-labelledby="laboratorio" className="flex flex-col gap-8 px-4 lg:px-0">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-3 font-mono text-[11px] tracking-wide text-texto-secundario uppercase">
                <span>Laboratório</span>
                <span aria-hidden className="h-px w-6 bg-linha" />
                <span>Sem avaliação, sem XP</span>
              </p>
              <h2
                id="laboratorio"
                className="font-display text-[36px] leading-[1] font-medium tracking-[-0.045em] text-balance lg:text-[52px]"
              >
                O que você não diz, a IA adivinha.
              </h2>
            </div>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-texto-secundario lg:pb-1">
              Ligue os trechos do prompt e troque os valores sublinhados. O resultado é simulado, mas responde a cada
              decisão como uma IA de código responderia.
            </p>
          </div>
          <PromptPlayground scenario={scenario} />
        </section>

        <section aria-labelledby="atividades" className="flex flex-col gap-4 px-4 lg:px-0">
          <h2
            id="atividades"
            className="flex min-h-11 items-center justify-between gap-3 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="size-2 rounded-[2px] bg-pratica" />
              Atividades avaliadas
            </span>
            <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
              {formatTwoDigits(activities.length)} de {formatTwoDigits(practice.activities.length)}
            </span>
          </h2>
          <FilterBar label="Filtrar por tipo" options={filterOptions} activeId={activeKind ?? "todos"} />
          <ActivityList activities={activities} numberOf={numberOf} />
        </section>
      </main>
    </>
  );
}
