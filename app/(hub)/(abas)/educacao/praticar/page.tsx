import { Target } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { activityKinds, type ActivityKind } from "@/lib/data/praticar";
import { EducationTabs } from "../_components/education-tabs";
import { ActivityList } from "./_components/activity-list";
import { KindFilter } from "./_components/kind-filter";
import { getPractice } from "./_data-access/get-practice";

export const metadata: Metadata = { title: "Praticar" };

/** Lê `?tipo=` e aceita só os tipos conhecidos. */
function parseKind(raw: string | string[] | undefined): ActivityKind | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return activityKinds.find((kind) => kind === value) ?? null;
}

/** Área Praticar da Educação (Figma: "Praticar"). O filtro fica na URL. */
export default async function PracticePage({ searchParams }: PageProps<"/educacao/praticar">) {
  const practice = await getPractice();
  const activeKind = parseKind((await searchParams).tipo);
  const activities = activeKind
    ? practice.activities.filter((activity) => activity.kind === activeKind)
    : practice.activities;

  return (
    <>
      <PageHeader title={practice.title} subtitle={practice.subtitle} icon={Target} tone="pratica">
        <EducationTabs active="praticar" />
      </PageHeader>
      <main className="flex flex-col gap-5 pt-6 pb-8 lg:pb-0">
        <KindFilter active={activeKind} />
        <ActivityList activities={activities} />
      </main>
    </>
  );
}
