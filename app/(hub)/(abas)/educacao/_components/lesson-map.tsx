import { Check, ListOrdered } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { LessonStatus, TrackModule } from "@/lib/data/trilha";
import { cn } from "@/lib/utils";

const statusLabel: Record<LessonStatus, string> = {
  concluida: "Concluída",
  "em-andamento": "Em andamento",
  bloqueada: "Bloqueada",
};

const markerClasses: Record<LessonStatus, string> = {
  concluida: "bg-trilha text-texto",
  "em-andamento": "bg-texto text-fundo",
  bloqueada: "bg-superficie-forte text-desativado",
};

const titleClasses: Record<LessonStatus, string> = {
  concluida: "text-texto",
  "em-andamento": "font-semibold text-texto",
  bloqueada: "text-texto-secundario",
};

type MapRowProps = {
  marker: ReactNode;
  markerClassName: string;
  title: string;
  titleClassName: string;
  status: string;
  href?: string;
};

function MapRow({
  marker,
  markerClassName,
  title,
  titleClassName,
  status,
  href,
}: MapRowProps) {
  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center text-xs font-bold",
          markerClassName,
        )}
      >
        {marker}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className={cn("text-sm", titleClassName)}>{title}</span>
        <span className="text-xs text-texto-secundario">{status}</span>
      </span>
    </>
  );

  const rowClassName = "flex min-h-11 items-center gap-3";

  return href ? (
    <Link href={href} className={rowClassName}>
      {content}
    </Link>
  ) : (
    <div className={rowClassName}>{content}</div>
  );
}

function Connector({ isReached }: { isReached: boolean }) {
  return (
    <span aria-hidden className="flex h-3 w-7 justify-center">
      <span className={cn("w-px", isReached ? "bg-texto" : "bg-desativado")} />
    </span>
  );
}

type LessonMapProps = {
  trackModule: TrackModule;
};

/** Mapa de lições do módulo, de cima para baixo, terminando no checkpoint. */
export function LessonMap({ trackModule }: LessonMapProps) {
  const isCheckpointLocked = trackModule.checkpoint.status === "bloqueado";

  return (
    <nav aria-labelledby="licoes-do-modulo" className="flex flex-col gap-2">
      <SectionHeading
        id="licoes-do-modulo"
        title="Lições do módulo"
        icon={ListOrdered}
        tone="trilha"
      />
      <SurfaceCard as="div" className="px-4 py-3 lg:px-6 lg:py-5">
        <ol>
          {trackModule.lessons.map((lesson) => (
            <li key={lesson.id}>
              <MapRow
                marker={
                  lesson.status === "concluida" ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : (
                    lesson.number
                  )
                }
                markerClassName={cn(
                  "rounded-full",
                  markerClasses[lesson.status],
                )}
                title={`Lição ${lesson.number} · ${lesson.title}`}
                titleClassName={titleClasses[lesson.status]}
                status={statusLabel[lesson.status]}
                href={
                  lesson.status === "bloqueada"
                    ? undefined
                    : `/educacao/licao/${lesson.id}`
                }
              />
              <Connector isReached={lesson.status === "concluida"} />
            </li>
          ))}

          <li>
            {/* No protótipo o checkpoint abre mesmo bloqueado, para dar para apresentar a tela. */}
            <MapRow
              marker="C"
              markerClassName={cn(
                "rounded-sm",
                isCheckpointLocked
                  ? markerClasses.bloqueada
                  : markerClasses["em-andamento"],
              )}
              title={`Checkpoint · Revisão do módulo ${trackModule.number}`}
              titleClassName={
                isCheckpointLocked
                  ? titleClasses.bloqueada
                  : titleClasses["em-andamento"]
              }
              status={isCheckpointLocked ? "Bloqueado" : "Liberado"}
              href={`/educacao/checkpoint/${trackModule.id}`}
            />
          </li>
        </ol>
      </SurfaceCard>
    </nav>
  );
}
