import type { LandingData } from "@/lib/data/landing";
import { CountUp } from "./count-up";
import { Reveal } from "./reveal";
import { LandingSection, SectionIntro } from "./section-intro";

type ProofSectionProps = {
  proof: LandingData["proof"];
  index: number;
};

/**
 * Números do hub em quatro colunas separadas por linhas finas (números
 * grandes e finos, que contam ao aparecer) e um depoimento em destaque.
 */
export function ProofSection({ proof, index }: ProofSectionProps) {
  const titleId = `${proof.id}-titulo`;

  return (
    <LandingSection id={proof.id} titleId={titleId}>
      <SectionIntro index={index} eyebrow={proof.eyebrow} title={proof.title} titleId={titleId} />

      <dl className="mt-14 grid grid-cols-2 border-linha lg:mt-20 lg:grid-cols-4">
        {proof.stats.map((stat, statIndex) => (
          <Reveal
            key={stat.label}
            delay={statIndex * 0.08}
            className="flex flex-col gap-3 border-t border-linha py-6 pr-4 odd:pr-4 even:border-l even:pl-4 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
          >
            <dt className="order-2 max-w-[22ch] text-sm leading-snug text-texto-secundario">{stat.label}</dt>
            <dd className="order-1 font-display text-[clamp(56px,7vw,104px)] leading-[0.9] font-light tracking-[-0.06em] tabular-nums">
              <CountUp value={stat.value} />
              {stat.suffix ? <span className="text-[0.5em] tracking-[-0.02em]">{stat.suffix}</span> : null}
            </dd>
          </Reveal>
        ))}
      </dl>

      <Reveal className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10">
        <span aria-hidden className="hidden font-display text-[96px] leading-none text-pratica lg:block">
          “
        </span>
        <figure className="flex flex-col gap-6">
          <blockquote className="font-display text-[clamp(24px,2.8vw,38px)] leading-[1.15] font-medium tracking-[-0.03em] text-balance">
            <span className="lg:hidden">“</span>
            {proof.quote.text}”
          </blockquote>
          <figcaption className="flex items-center gap-3 text-sm">
            <span aria-hidden className="h-px w-6 bg-texto" />
            <span className="font-semibold">{proof.quote.author}</span>
            <span className="text-texto-secundario">{proof.quote.role}</span>
          </figcaption>
        </figure>
      </Reveal>
    </LandingSection>
  );
}
