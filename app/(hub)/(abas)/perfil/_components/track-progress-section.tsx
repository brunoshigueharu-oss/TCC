import { BookOpen } from "lucide-react";

import { ActionLink } from "@/components/action-link";
import { ProgressBar } from "@/components/progress-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { formatTwoDigits } from "@/lib/format";
import type { TrackSummary } from "../_data-access/get-my-profile";

type TrackProgressSectionProps = {
  track: TrackSummary;
};

/** Progresso no módulo atual da trilha, com atalho para continuar. */
export function TrackProgressSection({ track }: TrackProgressSectionProps) {
  const continueHref = track.currentLessonId ? `/educacao/licao/${track.currentLessonId}` : "/educacao";

  return (
    <section aria-labelledby="progresso-trilha" className="flex flex-col gap-2">
      <SectionHeading
        id="progresso-trilha"
        title="Progresso na trilha"
        href="/educacao"
        icon={BookOpen}
        tone="trilha"
      />
      <SurfaceCard className="flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold text-texto-secundario">
          Módulo {formatTwoDigits(track.moduleNumber)}
        </p>
        <p className="-mt-2 font-display text-lg leading-snug font-bold">{track.moduleTitle}</p>
        <ProgressBar value={track.completed} max={track.total} label="Progresso do módulo" />
        <p className="text-sm text-texto-secundario">
          {track.completed} de {track.total} lições concluídas · {track.xpEarned} XP ganhos
        </p>
        <ActionLink href={continueHref} variant="secondary">
          Continuar a trilha
        </ActionLink>
      </SurfaceCard>
    </section>
  );
}
