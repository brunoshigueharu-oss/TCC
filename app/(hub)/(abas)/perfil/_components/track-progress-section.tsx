import { ArrowRight, Check, Lock } from "lucide-react";

import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/section-heading";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TrackSummary } from "../_data-access/get-my-profile";
import { SegmentProgress, type SegmentState } from "./motion/segment-progress";

const segmentByStatus = {
  concluida: "done",
  "em-andamento": "current",
  bloqueada: "todo",
} as const satisfies Record<string, SegmentState>;

type TrackProgressSectionProps = {
  track: TrackSummary;
};

/** Progresso no módulo atual: título, segmentos e as lições em lista de linhas. */
export function TrackProgressSection({ track }: TrackProgressSectionProps) {
  const continueHref = track.currentLessonId ? `/educacao/licao/${track.currentLessonId}` : "/educacao";

  return (
    <section aria-labelledby="progresso-trilha" className="flex flex-col lg:col-span-7">
      <SectionHeading
        id="progresso-trilha"
        title="Progresso na trilha"
        href="/educacao"
        tone="trilha"
        meta={`${formatTwoDigits(track.completed)} / ${formatTwoDigits(track.total)}`}
      />

      <div className="flex flex-col gap-5 px-4 pt-5 lg:px-0 lg:pt-6">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-texto-secundario">Módulo {formatTwoDigits(track.moduleNumber)}</p>
          <h3 className="font-display text-[28px] leading-[1.05] font-medium tracking-[-0.035em] lg:text-4xl">
            {track.moduleTitle}
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          <SegmentProgress
            segments={track.lessons.map((lesson) => segmentByStatus[lesson.status])}
            label={`${track.completed} de ${track.total} lições concluídas`}
          />
          <p className="flex justify-between gap-4 text-xs text-texto-secundario">
            <span>
              {track.completed} de {track.total} lições concluídas
            </span>
            <span className="font-mono tabular-nums">
              {track.xpEarned} / {track.xpTotal} XP
            </span>
          </p>
        </div>

        <ol className="divide-y divide-linha border-y border-linha">
          {track.lessons.map((lesson) => {
            const isCurrent = lesson.status === "em-andamento";
            const isLocked = lesson.status === "bloqueada";

            return (
              <li
                key={lesson.id}
                aria-current={isCurrent ? "step" : undefined}
                className={cn("flex min-h-11 items-center gap-4 py-2.5", isLocked && "text-texto-secundario")}
              >
                <span className="w-6 font-mono text-xs text-texto-secundario tabular-nums">
                  {formatTwoDigits(lesson.number)}
                </span>
                <span className={cn("min-w-0 flex-1 truncate text-[15px]", isCurrent ? "font-semibold" : "font-medium")}>
                  {lesson.title}
                </span>
                {isCurrent ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
                    em andamento
                  </span>
                ) : lesson.status === "concluida" ? (
                  <Check aria-label="Concluída" className="size-4" strokeWidth={2} />
                ) : (
                  <Lock aria-label="Bloqueada" className="size-3.5 text-desativado" strokeWidth={2} />
                )}
              </li>
            );
          })}
        </ol>

        <ActionLink href={continueHref} variant="secondary" className="self-start">
          Continuar a trilha
          <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </ActionLink>
      </div>
    </section>
  );
}
