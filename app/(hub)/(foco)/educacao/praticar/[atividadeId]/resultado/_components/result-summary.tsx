import { SurfaceCard } from "@/components/surface-card";
import { PracticeShapes } from "./practice-shapes";

type ResultSummaryProps = {
  title: string;
  met: number;
  total: number;
  xpEarned: number;
};

/** Cartão de topo: selo da avaliação, título, critérios atendidos e XP. */
export function ResultSummary({ title, met, total, xpEarned }: ResultSummaryProps) {
  return (
    <SurfaceCard as="section" aria-labelledby="titulo-resultado" className="flex lg:col-span-2">
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 lg:gap-4 lg:p-6">
        <p className="flex items-center gap-2 text-xs text-texto-secundario">
          <span className="rounded-md bg-pratica px-2 py-0.5 font-semibold text-texto">
            Avaliado pela IA
          </span>
          agora há pouco
        </p>
        <h1 id="titulo-resultado" className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">
          {title}
        </h1>
        <dl className="flex gap-6 lg:gap-10">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-texto-secundario">Critérios</dt>
            <dd className="font-display text-lg leading-none font-bold">
              {met} de {total}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-semibold text-texto-secundario">XP ganho</dt>
            <dd className="font-display text-lg leading-none font-bold">+{xpEarned} XP</dd>
          </div>
        </dl>
      </div>
      <div className="flex w-[34%] shrink-0 lg:w-[30%] items-center justify-center rounded-l-[999px] bg-pratica/15">
        <PracticeShapes className="size-24 lg:size-32" />
      </div>
    </SurfaceCard>
  );
}
