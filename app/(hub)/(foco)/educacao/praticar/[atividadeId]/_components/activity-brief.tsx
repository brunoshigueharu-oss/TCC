import { SurfaceCard } from "@/components/surface-card";
import { activityKindLabel, type Activity } from "@/lib/data/praticar";

type ActivityBriefProps = {
  activity: Activity;
};

/** Topo da atividade: tipo, nível, título, enunciado e código de apoio. */
export function ActivityBrief({ activity }: ActivityBriefProps) {
  return (
    <SurfaceCard as="section" aria-labelledby="titulo-atividade" className="flex flex-col gap-3 p-4 lg:gap-4 lg:p-6">
      <p className="flex flex-wrap items-center gap-2 text-xs text-texto-secundario">
        <span className="rounded-md bg-pratica/15 px-2 py-0.5 font-semibold text-texto">
          {activityKindLabel[activity.kind]}
        </span>
        {activity.level} · ≈ {activity.minutes} min · +{activity.xpReward} XP
      </p>
      <h1 id="titulo-atividade" className="font-display text-[22px] leading-tight font-bold lg:text-[26px]">
        {activity.shortTitle}
      </h1>
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-semibold text-texto-secundario">Enunciado</h2>
        <p className="text-[15px] leading-relaxed">{activity.statement}</p>
      </div>
      {activity.codeSample ? (
        <figure className="flex flex-col gap-1.5">
          <figcaption className="text-xs font-semibold text-texto-secundario">
            Código gerado pela IA
          </figcaption>
          <pre className="overflow-x-auto rounded-xl bg-superficie p-3 font-mono text-[13px] leading-relaxed">
            <code>{activity.codeSample}</code>
          </pre>
        </figure>
      ) : null}
    </SurfaceCard>
  );
}
