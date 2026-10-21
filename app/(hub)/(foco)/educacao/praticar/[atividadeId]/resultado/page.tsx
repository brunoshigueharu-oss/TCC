import { MessageSquareText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { getEvaluationSummary } from "@/lib/data/praticar";
import { getActivity, getNextActivity } from "../../_data-access/get-activity";
import { ResultSummary } from "./_components/result-summary";
import { RubricList } from "./_components/rubric-list";

export const metadata: Metadata = { title: "Resultado da atividade" };

/**
 * Resultado da atividade (Figma: "Resultado da atividade"). No protótipo a
 * avaliação é a de exemplo guardada nos dados da atividade.
 */
export default async function ActivityResultPage({
  params,
}: PageProps<"/educacao/praticar/[atividadeId]/resultado">) {
  const { atividadeId } = await params;
  const activity = await getActivity(atividadeId);
  if (!activity) notFound();

  const nextActivity = await getNextActivity(activity.id);
  const summary = getEvaluationSummary(activity);

  return (
    <>
      <BackBar href="/educacao/praticar" label="Praticar" />
      <main className="flex flex-col gap-7 pt-5 pb-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6 lg:gap-y-8 lg:px-8 lg:pt-8">
        <ResultSummary
          title={activity.shortTitle}
          met={summary.met}
          total={summary.total}
          xpEarned={summary.xpEarned}
        />
        <RubricList criteria={activity.criteria} results={activity.sampleEvaluation.results} />

        <section aria-labelledby="comentario" className="flex flex-col gap-2">
          <SectionHeading id="comentario" title="Comentário" icon={MessageSquareText} tone="pratica" />
          <SurfaceCard className="p-4">
            <p className="text-[15px] leading-relaxed">{activity.sampleEvaluation.comment}</p>
          </SurfaceCard>
        </section>

        <div className="flex gap-3 px-4 lg:col-span-2 lg:justify-end lg:px-0">
          <ActionLink
            href={`/educacao/praticar/${activity.id}`}
            variant="secondary"
            className="h-12 flex-1 lg:w-44 lg:flex-none"
          >
            Refazer
          </ActionLink>
          <ActionLink href={`/educacao/praticar/${nextActivity.id}`} className="flex-[2] lg:w-60 lg:flex-none">
            Próxima atividade
          </ActionLink>
        </div>
      </main>
    </>
  );
}
