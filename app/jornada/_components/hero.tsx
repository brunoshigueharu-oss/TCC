import type { Journey } from "@/lib/data/learning-journey";

type HeroProps = {
  journey: Pick<Journey, "heroEyebrow" | "heroTitle" | "heroSubhead" | "startDate" | "updatedDate">;
};

export function Hero({ journey }: HeroProps) {
  return (
    <header className="flex flex-col gap-4 px-6 pt-16 pb-10 sm:px-10">
      <p className="font-journey-mono text-xs tracking-[0.08em] text-journey-ink-soft uppercase">
        {journey.heroEyebrow}
      </p>
      <h1 className="font-journey-mono text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {journey.heroTitle}
      </h1>
      <p className="max-w-[62ch] text-lg text-journey-ink-soft">{journey.heroSubhead}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-journey-line pt-3 font-journey-mono text-xs text-journey-ink-soft">
        <span>autor: Bruno Higashi</span>
        <span>início: {journey.startDate}</span>
        <span>última atualização: {journey.updatedDate}</span>
      </div>
    </header>
  );
}
