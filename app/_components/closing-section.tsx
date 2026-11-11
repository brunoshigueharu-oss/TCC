import { ColorBurstLink } from "@/components/color-burst-link";
import type { LandingData } from "@/lib/data/landing";
import { AsciiBloom } from "./ascii-bloom";
import { Reveal } from "./reveal";

type ClosingSectionProps = {
  closing: LandingData["closing"];
};

/**
 * Chamada final: rima com o herói (título grande centralizado, uma flor em
 * caracteres) para fechar a página no mesmo tom em que ela abriu.
 */
export function ClosingSection({ closing }: ClosingSectionProps) {
  return (
    <section
      aria-labelledby="chamada-final"
      className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center overflow-hidden px-4 pt-24 pb-28 text-center sm:px-10 lg:px-16 lg:pt-32 lg:pb-40"
    >
      <AsciiBloom
        flower="florescer"
        src="/entrada/florescer.mp4"
        className="pointer-events-none mb-4 aspect-[4/3] w-[220px] sm:w-[260px]"
      />
      <Reveal className="flex flex-col items-center">
        <h2
          id="chamada-final"
          className="font-display text-[clamp(40px,6.4vw,96px)] leading-[0.98] font-medium tracking-[-0.05em] text-balance"
        >
          {closing.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-[460px] text-base leading-relaxed text-texto-secundario sm:text-lg">
          {closing.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ColorBurstLink href={closing.primaryCta.href}>{closing.primaryCta.label}</ColorBurstLink>
          <ColorBurstLink href={closing.secondaryCta.href} variant="secondary" size="md">
            {closing.secondaryCta.label}
          </ColorBurstLink>
        </div>
      </Reveal>
    </section>
  );
}
