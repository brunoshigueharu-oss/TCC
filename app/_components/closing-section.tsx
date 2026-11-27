import { ColorBurstLink } from "@/components/color-burst-link";
import type { LandingData } from "@/lib/data/landing";
import { CollageLamp } from "./closing/collage-lamp";
import { Reveal } from "./reveal";
import { ShuffleText } from "./shuffle-text";

type ClosingSectionProps = {
  closing: LandingData["closing"];
  /** A mesma ação do herói e do header. */
  cta: LandingData["primaryCta"];
};

/**
 * Chamada final, na faixa preta: título grande com a última palavra trocando
 * de letras sozinha, o botão e duas lâmpadas de colagem, pousadas como numa
 * mesa vista de cima, que acendem com o mouse em cima. O respiro de cima e de
 * baixo guarda o lugar das lâmpadas.
 */
export function ClosingSection({ closing, cta }: ClosingSectionProps) {
  const lastLeadIndex = closing.titleLead.length - 1;

  return (
    <section
      aria-labelledby="chamada-final"
      className="relative isolate mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 py-44 text-center sm:px-10 lg:px-16"
    >
      <CollageLamp
        className="absolute top-8 right-[5%] w-[84px] -rotate-[20deg] sm:w-[104px] lg:top-12 lg:right-[7%] lg:w-[140px]"
        flickerClass="[animation-delay:-1.2s]"
      />
      <CollageLamp
        className="absolute bottom-8 left-[5%] w-[84px] rotate-[48deg] sm:w-[104px] lg:bottom-12 lg:left-[7%] lg:w-[140px]"
        flickerClass="[animation-delay:-3.7s] [animation-duration:6.2s]"
      />

      <Reveal className="relative flex flex-col items-center">
        <h2
          id="chamada-final"
          className="font-display text-[clamp(40px,6.4vw,96px)] leading-[0.98] font-medium tracking-[-0.05em]"
        >
          {closing.titleLead.map((line, index) => (
            <span key={line} className="block">
              {line}
              {index === lastLeadIndex ? (
                <>
                  {" "}
                  {/* A palavra e o ponto final andam juntos: o ponto nunca cai sozinho na linha de baixo. */}
                  <span className="whitespace-nowrap">
                    <ShuffleText text={closing.titleWord} trigger="auto" />
                    {closing.titleEnd}
                  </span>
                </>
              ) : null}
            </span>
          ))}
        </h2>
        <ColorBurstLink href={cta.href} className="mt-10">
          {cta.label}
        </ColorBurstLink>
        <p className="mt-4 text-sm text-texto-secundario">{closing.note}</p>
      </Reveal>
    </section>
  );
}
