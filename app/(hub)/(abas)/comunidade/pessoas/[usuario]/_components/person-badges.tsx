import { Award } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { Badge } from "@/lib/data/pessoas";

type PersonBadgesProps = {
  firstName: string;
  badges: Badge[];
};

/** Selos de proficiência que a pessoa já conquistou. */
export function PersonBadges({ firstName, badges }: PersonBadgesProps) {
  return (
    <section aria-labelledby="selos-pessoa" className="flex flex-col gap-2">
      <SectionHeading id="selos-pessoa" title="Selos de proficiência" icon={Award} tone="trilha" />
      <SurfaceCard>
        {badges.length > 0 ? (
          <ul className="divide-y divide-linha">
            {badges.map((badge) => (
              <li key={badge.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-trilha">
                  <Award aria-hidden className="size-5 text-texto" strokeWidth={1.75} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold">{badge.title}</span>
                  <span className="text-xs text-texto-secundario">Nível {badge.level}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-4 text-sm text-texto-secundario">
            {firstName} ainda não fez nenhum teste de proficiência.
          </p>
        )}
      </SurfaceCard>
    </section>
  );
}
