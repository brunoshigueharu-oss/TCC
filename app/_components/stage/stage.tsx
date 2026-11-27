"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState, type ComponentType } from "react";

import { createArrowKeyHandler } from "@/lib/arrow-keys";
import { EASE_OUT } from "@/lib/motion";
import type { LandingData, StagePiece, StagePieceKind } from "@/lib/data/landing";
import { AccentDot } from "../accent-dot";
import { ArrowButton } from "../arrow-button";
import { ExpandPillPanel } from "../expand-pill";
import { InteractionHint } from "../interaction-hint";
import { StepCounter } from "../step-counter";
import { CollagePiece } from "./collage-piece";
import { FilmPiece } from "./film-piece";
import { GlyphPiece } from "./glyph-piece";
import { OrbPiece, type OrbPieceStage } from "./orb-piece";
import { TracePiece } from "./trace-piece";

type StageProps = {
  stage: LandingData["stage"];
  /** Nomes dos objetos da peça 3D (`lib/data/orbe.ts`), vindos da página. */
  orbStages: readonly OrbPieceStage[];
};

/** A peça interativa de cada tipo; a 3D recebe os nomes dos objetos e é montada à parte. */
const pieceComponents: Record<Exclude<StagePieceKind, "orbe">, ComponentType> = {
  vetorizacao: TracePiece,
  caracteres: GlyphPiece,
  manifesto: FilmPiece,
  colagem: CollagePiece,
};

/** A peça interativa do palco para um tipo de peça. */
function PieceView({ kind, orbStages }: { kind: StagePieceKind; orbStages: readonly OrbPieceStage[] }) {
  if (kind === "orbe") return <OrbPiece stages={orbStages} />;
  const Piece = pieceComponents[kind];
  return <Piece />;
}

type PromptDetailsProps = {
  piece: StagePiece;
  promptHeading: string;
  behindHeading: string;
};

/**
 * Conteúdo do painel "ver como foi feito": primeiro o que já estava pronto no
 * projeto (o sistema, que é o que o BASE8 ensina) e, ao lado, o pedido.
 */
function PromptDetails({ piece, promptHeading, behindHeading }: PromptDetailsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      <div className="flex flex-col gap-4">
        <h3 className="eyebrow">{behindHeading}</h3>
        <dl className="border-t border-linha">
          {piece.behind.map((item) => (
            <div key={item.label} className="border-b border-linha py-3">
              <dt className="flex items-center gap-3 text-[15px] font-medium">
                <AccentDot accent="acao" />
                {item.label}
              </dt>
              <dd className="mt-1 pl-[18px] text-sm leading-relaxed text-texto-secundario">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="eyebrow">{promptHeading}</h3>
        <p className="rounded-xl bg-superficie p-5 font-mono text-[13px] leading-relaxed">
          <span aria-hidden className="text-desativado select-none">
            &gt;{" "}
          </span>
          {piece.prompt}
        </p>
        <p className="text-[15px] leading-relaxed text-texto-secundario">{piece.summary}</p>
      </div>
    </div>
  );
}

/**
 * Palco de "o que dá para criar": uma peça interativa por vez no centro, com a
 * dica de como mexer nela logo abaixo. As setas (ou o teclado) trocam de peça,
 * a barra diz o que ela é e "ver o prompt" expande o pedido que a gerou. Só a
 * peça do momento fica montada, então o 3D e o vídeo das outras não rodam
 * escondidos.
 */
export function Stage({ stage, orbStages }: StageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = stage.pieces.length;
  const piece = stage.pieces[activeIndex];

  const step = (direction: 1 | -1) => setActiveIndex((current) => (current + direction + count) % count);

  // As setas dentro de uma peça (o divisor da vetorização) são dela.
  const handleKeyDown = createArrowKeyHandler(step);

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Exemplos do que dá para criar. Use as setas para trocar."
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex flex-col items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-8 focus-visible:ring-offset-superficie"
      >
        <StepCounter index={activeIndex} count={count} className="absolute top-6 right-7 sm:top-8 sm:right-10" />

        <div className="flex h-[340px] w-full items-center justify-center sm:h-[420px] lg:h-[460px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="flex size-full items-center justify-center"
            >
              <PieceView kind={piece.kind} orbStages={orbStages} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* A linha da dica guarda a altura mesmo sem texto, para o palco não pular entre as peças. */}
        <div className="mt-3 flex min-h-5 items-center justify-center">
          {piece.hint ? <InteractionHint hint={piece.hint} /> : null}
        </div>

        <div className="mt-4 flex w-full max-w-[560px] items-center justify-center gap-3">
          <ArrowButton direction={-1} label="Peça anterior" onStep={step} />
          <p
            aria-live="polite"
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full border border-linha bg-fundo px-5 py-2 text-center text-[15px] leading-tight font-medium text-balance"
          >
            {piece.name}
          </p>
          <ArrowButton direction={1} label="Próxima peça" onStep={step} />
        </div>

        <div className="mt-4">
          <ExpandPillPanel
            // Um painel por peça: ao trocar de peça, o painel aberto não fica com o conteúdo errado.
            key={piece.id}
            label={stage.promptLabel}
            accent="acao"
            eyebrow={stage.panelEyebrow}
            title={piece.name}
          >
            <PromptDetails piece={piece} promptHeading={stage.promptHeading} behindHeading={stage.behindHeading} />
          </ExpandPillPanel>
        </div>
      </div>
    </MotionConfig>
  );
}
