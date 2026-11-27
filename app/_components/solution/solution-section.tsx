import type { LandingData } from "@/lib/data/landing";
import { LandingSection } from "../landing-section";
import { SolutionMap } from "./solution-map";

type SolutionSectionProps = {
  solution: LandingData["solution"];
};

/** Palavra do subtítulo com sublinhado e três riscos de ênfase, como no rascunho. */
function Emphasis({ children }: { children: string }) {
  return (
    <span className="relative inline-block font-medium text-texto">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        fill="none"
        className="absolute -bottom-1.5 left-0 h-2 w-full text-acao"
      >
        <path
          d="M1 5 C25 1.5 60 7 99 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 16 24"
        fill="none"
        className="absolute top-1/2 left-full ml-1.5 h-6 w-4 -translate-y-1/2 text-acao"
      >
        <path d="M2 7 L9 2 M3 12 H13 M2 17 L9 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Seção "a solução": o BASE8 no centro e, em volta, o que a plataforma
 * entrega. Cada tópico expande para explicar como.
 */
export function SolutionSection({ solution }: SolutionSectionProps) {
  return (
    <LandingSection
      id={solution.id}
      title={solution.title}
      hasShuffle
      className="relative"
      lead={
        <p className="text-lg text-texto-secundario sm:text-xl">
          {solution.lead} <Emphasis>{solution.highlight}</Emphasis>
        </p>
      }
    >
      {/* Granulado de papel atrás do mapa, sumindo nas bordas (sem caixa visível). */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-x-0 top-[18%] bottom-0 -z-10 opacity-[0.07] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_55%,black_30%,transparent_85%)]"
      />
      <div className="mt-12 lg:mt-16">
        <SolutionMap topics={solution.topics} eyebrow={solution.topicEyebrow} />
      </div>
    </LandingSection>
  );
}
