import { ActionLink } from "@/components/action-link";
import { ProgressBar } from "@/components/progress-bar";
import { SurfaceCard } from "@/components/surface-card";
import { getModuleProgress, type TrackModule } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";

type CurrentModuleCardProps = {
  trackModule: TrackModule;
};

/** Cartão do módulo atual, com progresso e atalho para a próxima lição. */
export function CurrentModuleCard({ trackModule }: CurrentModuleCardProps) {
  const progress = getModuleProgress(trackModule);
  const nextLesson = trackModule.lessons.find((lesson) => lesson.status === "em-andamento");

  return (
    <SurfaceCard as="section" aria-labelledby="modulo-atual" className="flex gap-4 p-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-xs font-semibold text-texto-secundario">
          Módulo {formatTwoDigits(trackModule.number)}
        </p>
        <h2 id="modulo-atual" className="mt-2 font-display text-lg leading-snug font-bold">
          {trackModule.title}
        </h2>
        <p className="mt-1 text-sm text-texto-secundario">
          {progress.completed} de {progress.total} lições · {progress.xpEarned} XP ganhos
        </p>
        <ProgressBar
          value={progress.completed}
          max={progress.total}
          label="Progresso do módulo"
          className="mt-3"
        />

        {nextLesson ? (
          <ActionLink href={`/educacao/licao/${nextLesson.id}`} className="mt-4">
            Continuar lição {nextLesson.number}
          </ActionLink>
        ) : null}
      </div>
    </SurfaceCard>
  );
}
