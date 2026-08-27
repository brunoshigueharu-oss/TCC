import { Newsreader, Space_Mono } from "next/font/google";

import { learningJourney } from "@/lib/data/learning-journey";
import { Hero } from "./_components/hero";
import { HorizontalTimeline } from "./_components/horizontal-timeline";
import { TrunkCommits } from "./_components/trunk-commits";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function JornadaPage() {
  return (
    <div
      className={`${spaceMono.variable} ${newsreader.variable} flex min-h-screen flex-col bg-journey-paper font-journey-serif text-journey-ink`}
    >
      <Hero journey={learningJourney} />
      <HorizontalTimeline branches={learningJourney.branches} />
      <TrunkCommits items={learningJourney.trunkItems} />
      <footer className="flex flex-col gap-2 px-6 py-10 font-journey-mono text-xs text-journey-ink-soft sm:px-10">
        <span>
          Cronologia reconstruída a partir de relato pessoal em 27/08/2026 — datas dentro do
          período são aproximadas.
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {learningJourney.sources.map((source) => (
            <a key={source.href} href={source.href} className="underline underline-offset-2">
              {source.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
