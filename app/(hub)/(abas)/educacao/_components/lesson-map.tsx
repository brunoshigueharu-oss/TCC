import { ArrowRight, Check, Lock } from "lucide-react";
import Link from "next/link";

import type { Lesson, LessonStatus, TrackModule } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusLabel: Record<LessonStatus, string> = {
  concluida: "Concluída",
  "em-andamento": "Agora",
  bloqueada: "Bloqueada",
};

function LessonRow({ lesson }: { lesson: Lesson }) {
  const isCurrent = lesson.status === "em-andamento";
  const isDone = lesson.status === "concluida";
  const isLocked = lesson.status === "bloqueada";

  const content = (
    <>
      <span
        className={cn(
          "w-9 shrink-0 font-mono text-[13px] tabular-nums",
          isCurrent ? "text-texto" : isDone ? "text-texto-secundario" : "text-desativado",
        )}
      >
        {formatTwoDigits(lesson.number)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "leading-snug",
            isCurrent
              ? "font-display text-[22px] font-medium tracking-[-0.03em] lg:text-[26px]"
              : "text-[15px] lg:text-base",
            isDone && "text-texto-secundario",
            isLocked && "text-desativado",
          )}
        >
          {lesson.title}
        </span>
        {isCurrent ? (
          <span className="max-w-[52ch] text-sm leading-relaxed text-texto-secundario">{lesson.summary}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-wide uppercase tabular-nums",
          isCurrent ? "text-texto" : isDone ? "text-texto-secundario" : "text-desativado",
        )}
      >
        <span className="hidden sm:inline">{isLocked ? `${lesson.minutes} min` : statusLabel[lesson.status]}</span>
        {isDone ? <Check aria-hidden className="size-3.5" strokeWidth={2} /> : null}
        {isLocked ? <Lock aria-hidden className="size-3.5" strokeWidth={1.75} /> : null}
        {isCurrent ? (
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2}
          />
        ) : null}
      </span>
      <span className="sr-only">{statusLabel[lesson.status]}</span>
    </>
  );

  const rowClass = cn(
    "group relative flex items-start gap-3 border-b border-linha py-4 outline-none transition-[padding,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-texto",
    isCurrent && "py-6",
    !isLocked && "hover:bg-superficie hover:px-3",
  );

  return isLocked ? (
    <div aria-disabled className={rowClass}>
      {content}
    </div>
  ) : (
    <Link href={`/educacao/licao/${lesson.id}`} aria-current={isCurrent ? "step" : undefined} className={rowClass}>
      {isCurrent ? <span aria-hidden className="absolute top-0 bottom-[-1px] -left-4 w-0.5 bg-trilha lg:-left-5" /> : null}
      {content}
    </Link>
  );
}

type LessonMapProps = {
  trackModule: TrackModule;
};

/** Mapa do módulo: lições numeradas em linhas, terminando no checkpoint. */
export function LessonMap({ trackModule }: LessonMapProps) {
  const checkpointLabel = {
    bloqueado: "Libera ao fim do módulo",
    liberado: "Liberado",
    concluido: "Concluído",
  }[trackModule.checkpoint.status];

  return (
    <nav aria-labelledby="licoes-do-modulo" className="flex flex-col px-4 lg:px-0">
      <h2
        id="licoes-do-modulo"
        className="flex min-h-11 items-center justify-between gap-3 border-b border-texto text-xs font-semibold tracking-[0.08em] uppercase"
      >
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
          Mapa do módulo
        </span>
        <span className="font-mono text-[11px] font-normal text-texto-secundario tabular-nums">
          {formatTwoDigits(trackModule.lessons.length)} lições + checkpoint
        </span>
      </h2>
      <ol>
        {trackModule.lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonRow lesson={lesson} />
          </li>
        ))}
        <li>
          {/* No protótipo o checkpoint abre mesmo bloqueado, para dar para apresentar a tela. */}
          <Link
            href={`/educacao/checkpoint/${trackModule.id}`}
            className="group flex items-center gap-3 py-4 outline-none transition-[padding,background-color] duration-200 hover:bg-superficie hover:px-3 focus-visible:ring-2 focus-visible:ring-texto"
          >
            <span className="w-9 shrink-0 font-mono text-[13px] text-texto-secundario">CP</span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-medium lg:text-base">
                Checkpoint · revisão do módulo {formatTwoDigits(trackModule.number)}
              </span>
              <span className="text-xs text-texto-secundario">{checkpointLabel}</span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-4 text-texto-secundario transition-transform duration-200 group-hover:translate-x-1 group-hover:text-texto"
              strokeWidth={2}
            />
          </Link>
        </li>
      </ol>
    </nav>
  );
}
