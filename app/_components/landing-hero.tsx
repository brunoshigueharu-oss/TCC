import { ActionLink } from "@/components/action-link";
import type { LandingData } from "@/lib/data/landing";
import { BauhausPanel } from "./bauhaus-panel";

type LandingHeroProps = Pick<LandingData, "eyebrow" | "title" | "subtitle" | "primaryCta">;

/**
 * Herói da Landing: chamada no centro, ilustrações nas laterais. No celular o
 * texto vem primeiro e as duas ilustrações ficam lado a lado embaixo.
 */
export function LandingHero({ eyebrow, title, subtitle, primaryCta }: LandingHeroProps) {
  return (
    <section
      aria-labelledby="landing-titulo"
      className="grid grid-cols-2 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)_minmax(0,1fr)] lg:items-center lg:gap-10"
    >
      <BauhausPanel side="esquerda" className="order-2 aspect-[4/5] lg:order-1" />

      <div className="order-1 col-span-2 flex flex-col items-center gap-5 py-6 text-center lg:order-2 lg:col-span-1 lg:py-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-texto-secundario uppercase">
          {eyebrow}
        </p>
        <h1
          id="landing-titulo"
          className="font-display text-[38px] leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-[60px]"
        >
          {title}
        </h1>
        <p className="max-w-[460px] text-base leading-relaxed text-texto-secundario">{subtitle}</p>
        <ActionLink href={primaryCta.href} className="mt-2 w-full max-w-[280px] sm:w-auto sm:px-8">
          {primaryCta.label}
        </ActionLink>
      </div>

      <BauhausPanel side="direita" className="order-3 aspect-[4/5]" />
    </section>
  );
}
