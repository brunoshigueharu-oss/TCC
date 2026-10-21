import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { getActivity } from "../_data-access/get-activity";
import { ActivityBrief } from "./_components/activity-brief";
import { AnswerForm } from "./_components/answer-form";
import { CriteriaList } from "./_components/criteria-list";

export async function generateMetadata({
  params,
}: PageProps<"/educacao/praticar/[atividadeId]">): Promise<Metadata> {
  const { atividadeId } = await params;
  const activity = await getActivity(atividadeId);
  return { title: activity ? activity.shortTitle : "Atividade" };
}

/** Atividade prática com IA de código (Figma: "Atividade"). */
export default async function ActivityPage({ params }: PageProps<"/educacao/praticar/[atividadeId]">) {
  const { atividadeId } = await params;
  const activity = await getActivity(atividadeId);
  if (!activity) notFound();

  return (
    <>
      <BackBar href="/educacao/praticar" label="Praticar" />
      <main className="flex flex-col gap-7 pt-5 pb-8">
        <ActivityBrief activity={activity} />
        <CriteriaList criteria={activity.criteria} />
        <AnswerForm activityId={activity.id} />
      </main>
    </>
  );
}
