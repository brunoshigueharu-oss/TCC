import type { LandingData } from "@/lib/data/landing";
import { ColorBurstLink } from "@/components/color-burst-link";
import { ShuffleTitle } from "./shuffle-title";

type LandingHeroProps = Pick<LandingData, "titleLines" | "subtitle" | "primaryCta">;

/**
 * Herói da Landing: só tipografia, centralizado e com muito respiro. As letras
 * do título perto do cursor embaralham entre fontes e formas coloridas. Ao
 * carregar, as palavras entram uma a uma saindo do desfoque (referência:
 * typeflow.studio, "Product Launch").
 */
export function LandingHero({ titleLines, subtitle, primaryCta }: LandingHeroProps) {
  return (
    <section
      aria-labelledby="landing-titulo"
      // Começa logo abaixo do header e deixa a próxima seção aparecer na dobra.
      className="flex flex-col items-center px-4 pt-14 pb-20 text-center sm:pt-16 lg:pt-20 lg:pb-24"
    >
      <ShuffleTitle id="landing-titulo" lines={titleLines} />
      <p className="mt-6 max-w-[560px] animate-fade-up [animation-delay:950ms] motion-reduce:animate-none text-base text-balance leading-relaxed text-texto-secundario sm:text-lg">
        {subtitle}
      </p>
      <ColorBurstLink
        href={primaryCta.href}
        className="mt-7 animate-fade-up [animation-delay:1100ms] motion-reduce:animate-none"
      >
        {primaryCta.label}
      </ColorBurstLink>
    </section>
  );
}
