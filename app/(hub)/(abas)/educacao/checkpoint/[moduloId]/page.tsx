import { Check, CircleHelp, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { getModuleProgress } from "@/lib/data/trilha";
import { getTrackModule } from "../../_data-access/get-track";

export const metadata: Metadata = { title: "Checkpoint" };

/** Revisão no fim do módulo (Figma: "Checkpoint"). */
export default async function CheckpointPage({
  params,
}: PageProps<"/educacao/checkpoint/[moduloId]">) {
  const { moduloId } = await params;
  const trackModule = await getTrackModule(moduloId);
  if (!trackModule) notFound();

  const { checkpoint } = trackModule;
  const progress = getModuleProgress(trackModule);

  return (
    <>
      <BackBar href="/educacao" label={`Trilha · Módulo ${trackModule.number}`} />
      {/* Computador: resumo e botão à esquerda; conteúdo da revisão à direita. */}
      <main className="flex flex-col gap-7 pt-5 pb-8 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-8 lg:gap-y-4 lg:pt-6 lg:pb-0">
        <SurfaceCard className="flex flex-col gap-4 p-4 lg:col-start-1 lg:row-start-1 lg:p-5">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-[22px] leading-tight font-bold">
              Checkpoint — Módulo {trackModule.number}
            </h1>
            <p className="text-sm text-texto-secundario">
              Revise o módulo antes de seguir para o próximo.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-xl bg-trilha/30 p-3">
              <dt className="text-xs font-semibold">XP ganho no módulo</dt>
              <dd className="font-display text-[22px] leading-none font-bold">+{progress.xpEarned} XP</dd>
            </div>
            <div className="flex flex-col gap-1 rounded-xl bg-superficie p-3">
              <dt className="text-xs font-semibold text-texto-secundario">Lições</dt>
              <dd className="font-display text-[22px] leading-none font-bold">
                {progress.completed} de {progress.total}
              </dd>
            </div>
          </dl>
        </SurfaceCard>

        <div className="contents lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-7">
          <section aria-labelledby="aprendeu" className="flex flex-col gap-2">
            <SectionHeading id="aprendeu" title="O que você aprendeu" icon={Sparkles} tone="trilha" />
            <SurfaceCard>
              <ul className="divide-y divide-linha">
                {checkpoint.learned.map((item) => (
                  <li key={item} className="flex items-start gap-3 px-4 py-3 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-trilha">
                      <Check aria-hidden className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </section>

          <section aria-labelledby="perguntas" className="flex flex-col gap-2">
            <SectionHeading
              id="perguntas"
              title={`Perguntas rápidas · ${checkpoint.quickQuestions.length}`}
              icon={CircleHelp}
              tone="pratica"
            />
            <SurfaceCard>
              <ol className="divide-y divide-linha">
                {checkpoint.quickQuestions.map((question, index) => (
                  <li key={question.text} className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-sm font-semibold">
                      {index + 1}. {question.text}
                    </span>
                    <span className="text-xs text-texto-secundario">{question.kind}</span>
                  </li>
                ))}
              </ol>
            </SurfaceCard>
          </section>
        </div>

        <div className="px-4 lg:col-start-1 lg:row-start-2 lg:px-0">
          {/* A tela de revisão do checkpoint não existe no mapa: por enquanto leva às práticas. */}
          <ActionLink href="/educacao/praticar">Fazer revisão</ActionLink>
        </div>
      </main>
    </>
  );
}
