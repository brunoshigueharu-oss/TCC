import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { activityKindLabel, type Activity } from "@/lib/data/praticar";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const levelRank: Record<Activity["level"], number> = {
  Iniciante: 1,
  Intermediário: 2,
  Avançado: 3,
};

/** Nível em três traços finos (1 = iniciante, 3 = avançado). */
function LevelMeter({ level }: { level: Activity["level"] }) {
  const rank = levelRank[level];
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              "w-[3px] rounded-[1px]",
              step === 1 ? "h-1.5" : step === 2 ? "h-2.5" : "h-3.5",
              step <= rank ? "bg-texto" : "bg-superficie-forte",
            )}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

type ActivityListProps = {
  activities: Activity[];
  /** Número fixo de cada atividade (posição na lista completa). */
  numberOf: (activityId: string) => number;
};

/** Atividades em linhas: número, tipo, título, nível, duração e XP. */
export function ActivityList({ activities, numberOf }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <p className="border-t border-linha py-6 text-sm text-texto-secundario">Nenhuma atividade deste tipo por enquanto.</p>
    );
  }

  return (
    <ol className="border-t border-linha">
      {activities.map((activity) => (
        <li key={activity.id}>
          <Link
            href={`/educacao/praticar/${activity.id}`}
            className="group grid grid-cols-[28px_minmax(0,1fr)_16px] items-start gap-x-4 gap-y-2 border-b border-linha py-5 outline-none transition-[padding,background-color] duration-200 hover:bg-superficie focus-visible:ring-2 focus-visible:ring-texto lg:grid-cols-[28px_minmax(0,1fr)_140px_120px_16px] lg:items-center lg:hover:px-3"
          >
            <span className="pt-1 font-mono text-[12px] text-texto-secundario tabular-nums lg:pt-0">
              {formatTwoDigits(numberOf(activity.id))}
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-texto-secundario uppercase">
                <span aria-hidden className="size-1.5 rounded-[1px] bg-pratica" />
                {activityKindLabel[activity.kind]}
              </span>
              <span className="text-[17px] leading-snug font-medium tracking-[-0.01em] lg:text-lg">{activity.title}</span>
              <span className="flex items-center gap-4 font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums lg:hidden">
                <LevelMeter level={activity.level} />
                <span>{activity.minutes} min</span>
                <span>+{activity.xpReward} XP</span>
              </span>
            </span>
            <span className="hidden font-mono text-[11px] tracking-wide text-texto-secundario uppercase lg:block">
              <LevelMeter level={activity.level} />
            </span>
            <span className="hidden text-right font-mono text-[11px] tracking-wide text-texto-secundario uppercase tabular-nums lg:block">
              {activity.minutes} min · <span className="text-texto">+{activity.xpReward} XP</span>
            </span>
            <ArrowRight
              aria-hidden
              className="mt-1 size-4 text-texto-secundario transition-transform duration-200 group-hover:translate-x-1 group-hover:text-texto lg:mt-0"
              strokeWidth={2}
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
