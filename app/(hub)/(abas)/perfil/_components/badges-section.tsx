import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { Badge } from "@/lib/data/pessoas";
import { formatTwoDigits } from "@/lib/format";
import { ProficiencySeal } from "./proficiency-seal";

type BadgesSectionProps = {
  badges: Badge[];
  lockedBadges: string[];
};

/** Selos conquistados no Teste de proficiência e os que ainda faltam. */
export function BadgesSection({ badges, lockedBadges }: BadgesSectionProps) {
  const total = badges.length + lockedBadges.length;

  return (
    <section aria-labelledby="selos" className="flex flex-col lg:col-span-5">
      <SectionHeading
        id="selos"
        title="Selos de proficiência"
        href="/educacao/proficiencia"
        tone="trilha"
        meta={`${formatTwoDigits(badges.length)} / ${formatTwoDigits(total)}`}
      />

      <ul className="mx-4 divide-y divide-linha border-b border-linha lg:mx-0">
        {badges.map((badge) => (
          <li key={badge.id} className="group flex items-center gap-5 py-4">
            <ProficiencySeal title={badge.title} level={badge.level} />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-display text-lg leading-tight font-medium tracking-[-0.02em]">{badge.title}</p>
              <p className="text-xs text-texto-secundario">Nível {badge.level} · conquistado</p>
            </div>
          </li>
        ))}
        {lockedBadges.map((title) => (
          <li key={title}>
            <Link
              href="/educacao/proficiencia"
              className="group flex items-center gap-5 py-4 outline-none transition-colors hover:bg-superficie focus-visible:bg-superficie lg:-mx-3 lg:rounded-lg lg:px-3"
            >
              <ProficiencySeal title={title} level={null} />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-display text-lg leading-tight font-medium tracking-[-0.02em] text-texto-secundario transition-colors group-hover:text-texto">
                  {title}
                </span>
                <span className="text-xs text-texto-secundario underline decoration-linha underline-offset-4 group-hover:decoration-texto">
                  Fazer o teste para conquistar
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
