import type { LandingData, LandingTone } from "@/lib/data/landing";
import { formatTwoDigits } from "@/lib/format";
import { toneBg } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { PillarSample } from "./pillar-sample";
import { Reveal } from "./reveal";
import { LandingSection, SectionIntro } from "./section-intro";

type PillarsSectionProps = {
  pillars: LandingData["pillars"];
  index: number;
};

/** Barra lateral que cresce no hover, na cor do pilar (classe literal). */
const toneGrowBar: Record<LandingTone, string> = {
  trilha: "bg-trilha",
  pratica: "bg-pratica",
  comunidade: "bg-comunidade",
  acao: "bg-acao",
};

/**
 * "Como funciona": os quatro pilares como linhas de um índice — número,
 * nome com o marcador da cor, título grande e, à direita, um recorte real
 * do hub. No hover, uma barra fina na cor do pilar desce pela lateral.
 */
export function PillarsSection({ pillars, index }: PillarsSectionProps) {
  const titleId = `${pillars.id}-titulo`;

  return (
    <LandingSection id={pillars.id} titleId={titleId}>
      <SectionIntro index={index} eyebrow={pillars.eyebrow} title={pillars.title} titleId={titleId} />

      <ol className="mt-14 lg:mt-20">
        {pillars.items.map((pillar, pillarIndex) => (
          <li key={pillar.id}>
            <Reveal>
              <article className="group relative grid gap-8 border-t border-linha py-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,4fr)] lg:gap-10 lg:py-14">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 left-0 h-px w-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full motion-reduce:transition-none",
                    toneGrowBar[pillar.tone],
                  )}
                />
                <div className="flex items-start justify-between gap-4 lg:flex-col lg:justify-start">
                  <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase">
                    <span aria-hidden className={cn("size-2 rounded-[2px]", toneBg[pillar.tone])} />
                    {pillar.name}
                  </p>
                  <span className="font-mono text-[11px] tabular-nums text-texto-secundario">
                    {formatTwoDigits(pillarIndex + 1)} / {formatTwoDigits(pillars.items.length)}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-[clamp(26px,2.6vw,36px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
                    {pillar.title}
                  </h3>
                  <p className="max-w-[44ch] text-[15px] leading-relaxed text-texto-secundario">
                    {pillar.description}
                  </p>
                </div>
                <PillarSample sample={pillar.sample} />
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
