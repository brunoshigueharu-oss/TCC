import { SectionHeading } from "@/components/section-heading";
import type { Milestone } from "@/lib/data/perfil";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Marcador de cada tipo de conquista, pela cor do pilar (classe literal). */
const kindMarker: Record<Milestone["kind"], string> = {
  inicio: "bg-texto",
  nivel: "bg-acao",
  selo: "bg-trilha",
  trilha: "bg-trilha",
  comunidade: "bg-comunidade",
};

type AchievementsTimelineProps = {
  milestones: Milestone[];
};

/** Linha do tempo de conquistas: do mais recente à entrada no hub. */
export function AchievementsTimeline({ milestones }: AchievementsTimelineProps) {
  return (
    <section aria-labelledby="linha-do-tempo" className="flex flex-col lg:col-span-7">
      <SectionHeading
        id="linha-do-tempo"
        title="Linha do tempo"
        tone="acao"
        meta={formatTwoDigits(milestones.length)}
      />

      <ol className="mx-4 lg:mx-0">
        {milestones.map((milestone, index) => (
          <li key={milestone.id} className="grid grid-cols-[52px_16px_minmax(0,1fr)] gap-x-3 lg:grid-cols-[64px_16px_minmax(0,1fr)] lg:gap-x-4">
            <span className="pt-4 font-mono text-xs text-texto-secundario tabular-nums">{milestone.dateLabel}</span>
            <span aria-hidden className="relative flex justify-center">
              <span
                className={cn(
                  "absolute inset-y-0 w-px bg-linha",
                  index === 0 && "top-5",
                  index === milestones.length - 1 && "bottom-auto h-5",
                )}
              />
              <span className={cn("relative mt-[18px] size-2 rounded-[2px] ring-4 ring-fundo", kindMarker[milestone.kind])} />
            </span>
            <span className="flex flex-col gap-0.5 border-b border-linha py-3.5">
              <span className="text-[15px] font-medium">{milestone.title}</span>
              <span className="text-sm leading-snug text-texto-secundario">{milestone.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
