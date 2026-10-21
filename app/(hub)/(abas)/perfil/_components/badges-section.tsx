import { Award, Lock } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { Badge } from "@/lib/data/pessoas";

type BadgesSectionProps = {
  badges: Badge[];
  lockedBadges: string[];
};

/** Selos conquistados no Teste de proficiência e os que ainda faltam. */
export function BadgesSection({ badges, lockedBadges }: BadgesSectionProps) {
  return (
    <section aria-labelledby="selos" className="flex flex-col gap-2">
      <SectionHeading
        id="selos"
        title="Selos de proficiência"
        href="/educacao/proficiencia"
        icon={Award}
        tone="trilha"
      />
      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {badges.map((badge) => (
            <li key={badge.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-trilha">
                <Award aria-hidden className="size-5 text-texto" strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold">{badge.title}</span>
                <span className="text-xs text-texto-secundario">Nível {badge.level} · conquistado</span>
              </span>
            </li>
          ))}
          {lockedBadges.map((title) => (
            <li key={title}>
              <Link href="/educacao/proficiencia" className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-superficie-forte">
                  <Lock aria-hidden className="size-4 text-desativado" strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-xs text-texto-secundario">Faça o teste para conquistar</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </SurfaceCard>
    </section>
  );
}
