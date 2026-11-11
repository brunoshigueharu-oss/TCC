import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionLink } from "@/components/action-link";
import { getModuleProgress } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";
import { getTrackModule } from "../../_data-access/get-track";

export const metadata: Metadata = { title: "Checkpoint" };

/** Revisão no fim do módulo (Figma: "Checkpoint"). */
export default async function CheckpointPage({ params }: PageProps<"/educacao/checkpoint/[moduloId]">) {
  const { moduloId } = await params;
  const trackModule = await getTrackModule(moduloId);
  if (!trackModule) notFound();

  const { checkpoint } = trackModule;
  const progress = getModuleProgress(trackModule);
  const isLocked = checkpoint.status === "bloqueado";

  const figures = [
    { label: "XP no módulo", value: `+${progress.xpEarned}` },
    { label: "Lições", value: `${formatTwoDigits(progress.completed)}/${formatTwoDigits(progress.total)}` },
    { label: "Perguntas", value: formatTwoDigits(checkpoint.quickQuestions.length) },
  ];

  return (
    <main className="flex flex-col pb-10 lg:pb-0">
      <div className="flex h-14 items-center px-2 lg:px-0">
        <Link
          href="/educacao"
          className="group flex h-11 items-center gap-2 rounded-full px-3 text-sm text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto lg:-ml-3"
        >
          <ArrowLeft aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} />
          Trilha · Módulo {formatTwoDigits(trackModule.number)}
        </Link>
      </div>

      <div className="flex flex-col gap-12 px-4 pt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-16 lg:px-0 lg:pt-8">
        <header className="flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-wide text-texto-secundario uppercase">
            <span>Checkpoint · Módulo {formatTwoDigits(trackModule.number)}</span>
            <span aria-hidden className="h-px w-6 bg-linha" />
            <span>{isLocked ? "Libera ao fim do módulo" : "Liberado"}</span>
          </p>
          <h1 className="font-display text-[40px] leading-[0.98] font-medium tracking-[-0.045em] text-balance lg:text-[60px]">
            {trackModule.title}
          </h1>
          <p className="max-w-[44ch] text-[17px] leading-[1.6] text-texto-secundario">
            Revise o módulo antes de seguir para o próximo. São perguntas rápidas, sem nota de corte.
          </p>
          <dl className="grid grid-cols-3 gap-4 pt-2">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col gap-2 border-t border-linha pt-3">
                <dt className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">{figure.label}</dt>
                <dd className="font-mono text-2xl font-light tabular-nums">{figure.value}</dd>
              </div>
            ))}
          </dl>
          {/* A tela de revisão do checkpoint não existe no mapa: por enquanto leva às práticas. */}
          <ActionLink href="/educacao/praticar" className="self-start">
            Fazer revisão
            <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </ActionLink>
        </header>

        <div className="flex flex-col gap-12">
          <section aria-labelledby="aprendeu" className="flex flex-col">
            <h2
              id="aprendeu"
              className="flex min-h-11 items-center gap-2.5 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
            >
              <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
              O que você aprendeu
            </h2>
            <ol>
              {checkpoint.learned.map((item, index) => (
                <li key={item} className="flex gap-4 border-b border-linha py-4">
                  <span className="w-6 shrink-0 pt-1 font-mono text-[11px] text-texto-secundario tabular-nums">
                    {formatTwoDigits(index + 1)}
                  </span>
                  <span className="font-display text-xl leading-snug font-medium tracking-[-0.02em]">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="perguntas" className="flex flex-col">
            <h2
              id="perguntas"
              className="flex min-h-11 items-center justify-between gap-3 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
            >
              <span className="flex items-center gap-2.5">
                <span aria-hidden className="size-2 rounded-[2px] bg-pratica" />
                Perguntas rápidas
              </span>
              <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
                {formatTwoDigits(checkpoint.quickQuestions.length)}
              </span>
            </h2>
            <ol>
              {checkpoint.quickQuestions.map((question, index) => (
                <li key={question.text} className="flex gap-4 border-b border-linha py-4">
                  <span className="w-6 shrink-0 pt-0.5 font-mono text-[11px] text-texto-secundario tabular-nums">
                    {formatTwoDigits(index + 1)}
                  </span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="text-[15px] leading-snug lg:text-base">{question.text}</span>
                    <span className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase">{question.kind}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
