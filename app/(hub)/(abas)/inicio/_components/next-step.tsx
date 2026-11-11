import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/section-heading";
import { formatTwoDigits } from "@/lib/format";
import { SegmentProgress, type SegmentState } from "../../perfil/_components/motion/segment-progress";
import type { CurrentLessonSummary } from "../_data-access/get-home-data";

const segmentByStatus = {
  concluida: "done",
  "em-andamento": "current",
  bloqueada: "todo",
} as const satisfies Record<string, SegmentState>;

type NextStepProps = {
  current: CurrentLessonSummary;
};

/**
 * O próximo passo, em destaque absoluto: a lição em andamento com título
 * grande, o número da lição em mono fino, o progresso do módulo em segmentos
 * e a ação principal da tela. Embaixo, as lições seguintes em lista de linhas.
 */
export function NextStep({ current }: NextStepProps) {
  const { lesson, moduleNumber, moduleTitle, completedLessons, lessonsTotal, lessonStates, upcomingLessons } = current;

  return (
    <section aria-labelledby="proximo-passo" className="flex flex-col lg:col-span-8">
      <SectionHeading
        id="proximo-passo"
        title="Próximo passo"
        tone="trilha"
        meta={`${formatTwoDigits(lesson.number)} / ${formatTwoDigits(lessonsTotal)}`}
      />

      <div className="relative flex flex-col gap-6 px-4 pt-6 pb-7 lg:px-0 lg:pt-8 lg:pb-9">
        <span
          aria-hidden
          className="pointer-events-none absolute top-4 right-4 font-mono text-[72px] leading-none font-extralight tracking-[-0.06em] text-superficie-forte tabular-nums lg:top-6 lg:right-0 lg:text-[136px]"
        >
          {formatTwoDigits(lesson.number)}
        </span>

        <div className="relative flex flex-col gap-3">
          <p className="text-sm text-texto-secundario">
            Módulo {formatTwoDigits(moduleNumber)} · {moduleTitle}
          </p>
          <h3 className="max-w-[14ch] font-display text-[36px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[56px]">
            {lesson.title}
          </h3>
          <p className="font-mono text-xs tracking-[0.04em] text-texto-secundario uppercase tabular-nums">
            {lesson.minutes} min · +{lesson.xpReward} XP · {lesson.steps.length} passos
          </p>
        </div>

        <div className="relative flex flex-col gap-2">
          <SegmentProgress
            segments={lessonStates.map((status) => segmentByStatus[status])}
            label={`${completedLessons} de ${lessonsTotal} lições do módulo concluídas`}
            className="max-w-[420px]"
          />
          <p className="text-xs text-texto-secundario">
            {completedLessons} de {lessonsTotal} lições do módulo concluídas
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-x-5 gap-y-3">
          <ActionLink href={`/educacao/licao/${lesson.id}`} className="w-full sm:w-auto">
            Continuar lição
            <ArrowRight aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </ActionLink>
          <Link
            href="/educacao"
            className="flex min-h-11 items-center text-sm font-semibold underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:decoration-texto"
          >
            Ver a trilha inteira
          </Link>
        </div>
      </div>

      {upcomingLessons.length > 0 ? (
        <div className="mx-4 border-t border-linha lg:mx-0">
          <p className="pt-4 pb-1 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">A seguir</p>
          <ol className="divide-y divide-linha">
            {upcomingLessons.map((nextLesson) => (
              <li key={nextLesson.id} className="flex min-h-12 items-center gap-4 py-2.5 text-texto-secundario">
                <span className="w-6 font-mono text-xs tabular-nums">{formatTwoDigits(nextLesson.number)}</span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{nextLesson.title}</span>
                <span className="font-mono text-xs tabular-nums">{nextLesson.minutes} min</span>
                <Lock aria-label="Bloqueada" className="size-3.5 text-desativado" strokeWidth={2} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
