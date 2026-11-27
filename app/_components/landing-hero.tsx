import type { LandingData } from "@/lib/data/landing";
import { ColorBurstLink } from "@/components/color-burst-link";
import { AsciiBloom } from "./ascii-bloom";
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
      // Começa logo abaixo do header e deixa a próxima seção aparecer na dobra,
      // com respiro suficiente entre o botão e o painel do palco.
      className="relative flex flex-col items-center overflow-x-clip px-4 pt-14 pb-24 text-center sm:pt-16 lg:pt-20 lg:pb-32"
    >
      {/* Enfeites nas laterais, só onde sobra espaço ao lado do título (~840px de largura). */}
      <AsciiBloom
        flower="lirio"
        src="/landing/lirio.mp4"
        hasBleed
        className="absolute top-1/2 left-0 hidden aspect-square w-[calc(50vw-425px)] max-w-[520px] -translate-y-1/2 xl:block"
      />
      <AsciiBloom
        flower="gerbera"
        src="/landing/gerbera.mp4"
        hasBleed
        className="absolute top-1/2 right-0 hidden aspect-square w-[calc(50vw-425px)] max-w-[520px] -translate-y-1/2 xl:block"
      />
      {/*
        Abaixo de 1280px não sobra lateral: uma flor só, pequena, no canto de
        baixo, ao lado do botão e sem encostar no texto. Uma só para o celular
        não carregar dois vídeos.
      */}
      <AsciiBloom
        flower="gerbera"
        src="/landing/gerbera.mp4"
        className="absolute right-1 bottom-6 aspect-square w-24 sm:right-6 sm:w-36 xl:hidden"
      />
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
