import type { LandingData } from "@/lib/data/landing";
import type { OrbPieceStage } from "./orb-piece";
import { Stage } from "./stage";

type StageSectionProps = {
  stage: LandingData["stage"];
  orbStages: readonly OrbPieceStage[];
};

/**
 * Seção "o que dá para criar?": um painel claro logo abaixo do herói, com o
 * palco das peças. Fica em `superficie` (e não no preto) porque a peça de
 * abertura é a bola 8, que some em fundo escuro.
 */
export function StageSection({ stage, orbStages }: StageSectionProps) {
  const titleId = `${stage.id}-titulo`;

  return (
    <section id={stage.id} aria-labelledby={titleId} className="isolate scroll-mt-20 px-2 sm:px-4 lg:px-6">
      {/* Na largura das outras seções (1280px), para o painel não sobrar vazio nas telas largas. */}
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] bg-superficie px-4 pt-14 pb-10 sm:rounded-[36px] sm:pt-16 sm:pb-12">
        <h2
          id={titleId}
          className="text-center font-display text-[clamp(28px,3.6vw,48px)] leading-none font-medium tracking-[-0.04em] text-balance"
        >
          {stage.title}
        </h2>
        <div className="mt-6 sm:mt-8">
          <Stage stage={stage} orbStages={orbStages} />
        </div>
      </div>
    </section>
  );
}
