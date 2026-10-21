import { ChevronRight, Target } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { activityKindLabel, type Activity } from "@/lib/data/praticar";

type ActivityListProps = {
  activities: Activity[];
};

/** Lista de atividades práticas: tipo, nível, título, duração e XP. */
export function ActivityList({ activities }: ActivityListProps) {
  return (
    <section aria-labelledby="atividades" className="flex flex-col gap-2">
      <SectionHeading
        id="atividades"
        title={`Atividades · ${activities.length}`}
        icon={Target}
        tone="pratica"
      />

      <SurfaceCard>
        {activities.length > 0 ? (
          <ul className="divide-y divide-linha">
            {activities.map((activity) => (
              <li key={activity.id}>
                <Link
                  href={`/educacao/praticar/${activity.id}`}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-pratica/15 px-2 py-0.5 text-xs font-semibold">
                        {activityKindLabel[activity.kind]}
                      </span>
                      <span className="text-xs text-texto-secundario">{activity.level}</span>
                    </span>
                    <span className="text-[15px] leading-snug font-semibold">{activity.title}</span>
                    <span className="text-xs text-texto-secundario">
                      ≈ {activity.minutes} min · +{activity.xpReward} XP
                    </span>
                  </span>
                  <ChevronRight aria-hidden className="size-4 shrink-0 text-texto-secundario" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-6 text-sm text-texto-secundario">
            Nenhuma atividade deste tipo por enquanto.
          </p>
        )}
      </SurfaceCard>
    </section>
  );
}
