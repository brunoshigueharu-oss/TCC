import type { LandingFeature } from "@/lib/data/landing";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Classe literal de cada pilar (o Tailwind não lê nomes montados). */
const featureBg: Record<LandingFeature["tone"], string> = {
  trilha: "bg-trilha",
  pratica: "bg-pratica",
  comunidade: "bg-comunidade",
};

type FeatureCardsProps = {
  features: LandingFeature[];
};

/** Os três pilares do hub, um cartão cheio na cor de cada um. */
export function FeatureCards({ features }: FeatureCardsProps) {
  return (
    <section aria-labelledby="pilares">
      <h2 id="pilares" className="sr-only">
        O que você encontra
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <li
            key={feature.id}
            className={cn("flex flex-col gap-3 rounded-2xl p-6 text-texto", featureBg[feature.tone])}
          >
            <span className="font-display text-sm font-bold">{formatTwoDigits(index + 1)}</span>
            <h3 className="font-display text-xl leading-snug font-bold">{feature.title}</h3>
            <p className="text-[15px] leading-relaxed">{feature.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
