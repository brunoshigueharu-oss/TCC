import { ArrowRight } from "lucide-react";

import { ActionLink } from "@/components/action-link";
import { getModuleProgress, type Lesson, type TrackModule } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type ModuleOverviewProps = {
  trackModule: TrackModule;
  currentLesson: Lesson | null;
};

/**
 * Abertura do módulo: número e título grandes, progresso em segmentos e a
 * lição atual em destaque tipográfico, com o botão para continuar.
 */
export function ModuleOverview({ trackModule, currentLesson }: ModuleOverviewProps) {
  const progress = getModuleProgress(trackModule);

  return (
    <section aria-labelledby="modulo-atual" className="flex flex-col gap-8 px-4 lg:px-0">
      <div className="flex flex-col gap-5">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
          <span>Módulo {formatTwoDigits(trackModule.number)}</span>
          <span aria-hidden className="h-px w-6 bg-linha" />
          <span>Em andamento</span>
        </p>
        <h2
          id="modulo-atual"
          className="font-display text-[40px] leading-[0.98] font-medium tracking-[-0.045em] text-balance lg:text-[64px]"
        >
          {trackModule.title}
        </h2>

        <div className="flex flex-col gap-3">
          <ol aria-label={`${progress.completed} de ${progress.total} lições concluídas`} className="flex gap-1">
            {trackModule.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  lesson.status === "concluida"
                    ? "bg-texto"
                    : lesson.status === "em-andamento"
                      ? "bg-trilha"
                      : "bg-superficie-forte",
                )}
              />
            ))}
          </ol>
          <dl className="grid grid-cols-3 gap-4">
            {[
              { label: "Lições", value: `${formatTwoDigits(progress.completed)}/${formatTwoDigits(progress.total)}` },
              { label: "XP", value: `${progress.xpEarned}/${progress.xpTotal}` },
              { label: "Restam", value: `${progress.minutesLeft} min` },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                  {item.label}
                </dt>
                <dd className="font-mono text-lg font-light tabular-nums lg:text-xl">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {currentLesson ? (
        <div className="flex flex-col gap-4 border-t border-texto pt-5">
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
            <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
            Continue de onde parou
          </p>
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums">
              Lição {formatTwoDigits(currentLesson.number)} · {currentLesson.minutes} min · +{currentLesson.xpReward} XP
            </p>
            <p className="font-display text-[28px] leading-[1.05] font-medium tracking-[-0.035em] lg:text-[34px]">
              {currentLesson.title}
            </p>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-texto-secundario">{currentLesson.summary}</p>
          </div>
          <ActionLink href={`/educacao/licao/${currentLesson.id}`} className="self-start">
            Continuar lição
            <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </ActionLink>
        </div>
      ) : null}
    </section>
  );
}
