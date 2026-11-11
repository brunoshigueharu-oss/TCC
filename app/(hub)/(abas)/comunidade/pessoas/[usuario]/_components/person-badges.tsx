import { SectionHeading } from "@/components/section-heading";
import type { Badge } from "@/lib/data/pessoas";

type PersonBadgesProps = {
  firstName: string;
  badges: Badge[];
};

/** Selos de proficiência como lista sóbria: nome e nível em caixa alta. */
export function PersonBadges({ firstName, badges }: PersonBadgesProps) {
  return (
    <section aria-labelledby="selos-pessoa" className="flex flex-col">
      <SectionHeading
        id="selos-pessoa"
        title="Selos"
        tone="trilha"
        meta={String(badges.length).padStart(2, "0")}
      />
      {badges.length > 0 ? (
        <ul className="mx-4 divide-y divide-linha lg:mx-0">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className="flex items-baseline justify-between gap-3 py-3"
            >
              <span className="text-[15px] font-medium">{badge.title}</span>
              <span className="shrink-0 text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
                {badge.level}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mx-4 py-4 text-sm text-texto-secundario lg:mx-0">
          {firstName} ainda não fez nenhum teste de proficiência.
        </p>
      )}
    </section>
  );
}
