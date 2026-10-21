import { BookOpen, Lock } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import type { Lesson } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CurrentLessonSummary } from "../_data-access/get-home-data";
import { SectionHeading } from "@/components/section-heading";

type LessonCarouselProps = {
  current: CurrentLessonSummary;
};

const cardClass =
  "flex w-[86%] shrink-0 snap-start gap-4 rounded-2xl bg-fundo p-4 ring-1 ring-linha/70";

/** Miniatura do cartão: número da lição grande, no lugar de uma imagem. */
function LessonThumb({ lesson, isLocked }: { lesson: Lesson; isLocked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-[88px] shrink-0 items-center justify-center rounded-xl font-display text-[40px] font-bold",
        isLocked ? "bg-superficie-forte text-desativado" : "bg-trilha text-texto",
      )}
    >
      {formatTwoDigits(lesson.number)}
    </span>
  );
}

/**
 * "Continuar de onde parou": carrossel horizontal com a lição atual e as
 * próximas do módulo, no formato dos cartões de comunicado da referência.
 */
export function LessonCarousel({ current }: LessonCarouselProps) {
  const { lesson, moduleNumber, completedLessons, lessonsTotal, upcomingLessons } = current;

  return (
    <section aria-labelledby="continuar" className="flex flex-col gap-2">
      <SectionHeading
        id="continuar"
        title="Continuar de onde parou"
        href="/educacao"
        icon={BookOpen}
        tone="trilha"
      />

      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li className={cardClass}>
          <Link href={`/educacao/licao/${lesson.id}`} className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-texto-secundario">
              Módulo {formatTwoDigits(moduleNumber)} · Lição {formatTwoDigits(lesson.number)} de{" "}
              {formatTwoDigits(lessonsTotal)}
            </span>
            <span className="mt-2 font-display text-lg leading-snug font-bold">{lesson.title}</span>
            <span className="mt-1 text-sm text-texto-secundario">
              {lesson.minutes} min · +{lesson.xpReward} XP
            </span>
            <span className="mt-auto pt-3">
              <ProgressBar value={completedLessons} max={lessonsTotal} label="Progresso do módulo" />
            </span>
          </Link>
          <LessonThumb lesson={lesson} isLocked={false} />
        </li>

        {upcomingLessons.map((nextLesson) => (
          <li key={nextLesson.id} className={cardClass}>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-1 text-xs font-semibold text-texto-secundario">
                <Lock aria-hidden className="size-3" strokeWidth={2.5} />
                A seguir · Lição {formatTwoDigits(nextLesson.number)}
              </span>
              <span className="mt-2 font-display text-lg leading-snug font-bold">
                {nextLesson.title}
              </span>
              <span className="mt-1 text-sm text-texto-secundario">
                {nextLesson.minutes} min · +{nextLesson.xpReward} XP
              </span>
            </div>
            <LessonThumb lesson={nextLesson} isLocked />
          </li>
        ))}
      </ul>
    </section>
  );
}
