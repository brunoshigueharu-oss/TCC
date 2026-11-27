import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { ActionLink } from "@/components/action-link";
import type { LandingData, SolutionTopic, SolutionTopicId } from "@/lib/data/landing";
import { cn } from "@/lib/utils";
import { DotList } from "../dot-list";
import { ExpandPillPanel } from "../expand-pill";
import { Base8Logo } from "./base8-logo";
import { LineReveal, LogoReveal, MapStage, PillReveal } from "./map-reveal";

type SolutionMapProps = {
  topics: LandingData["solution"]["topics"];
  /** Rótulo pequeno do painel de cada tópico. */
  eyebrow: string;
};

/** Tamanho real das capturas do hub (1440×900 a 1,5×). */
const CAPTURE = { width: 2160, height: 1350 } as const;

type Slot = {
  /** Lugar da etiqueta no desktop (classes literais). */
  position: string;
  /** Linha até a palavra, em % da área do mapa: x1,y1 perto da etiqueta, x2,y2 perto das letras. */
  line: { x1: number; y1: number; x2: number; y2: number };
};

/** Lugar de cada tópico em volta do BASE8 no desktop, pelo id do tópico. */
const slots: Record<SolutionTopicId, Slot> = {
  aulas: { position: "lg:top-[13%] lg:left-0", line: { x1: 19, y1: 25, x2: 29, y2: 38 } },
  comunidade: { position: "lg:top-0 lg:right-[5%]", line: { x1: 73, y1: 13, x2: 67, y2: 35 } },
  cursos: { position: "lg:top-[45%] lg:right-0", line: { x1: 79.5, y1: 50, x2: 75, y2: 50 } },
  referencias: { position: "lg:bottom-[13%] lg:left-[4%]", line: { x1: 24, y1: 75, x2: 29, y2: 63 } },
  networking: { position: "lg:bottom-0 lg:left-[51%]", line: { x1: 57, y1: 88, x2: 54.5, y2: 67 } },
};

/** Conteúdo do painel de um tópico: como o hub entrega, fatos curtos, a tela real e o link. */
function TopicDetails({ topic }: { topic: SolutionTopic }) {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
      <div className="flex flex-col gap-6">
        <p className="text-base leading-relaxed text-texto-secundario">{topic.summary}</p>
        <DotList items={topic.facts} accent={topic.accent} />
        <ActionLink href={topic.link.href} variant="secondary" className="self-start">
          {topic.link.label}
          <ArrowRight aria-hidden />
        </ActionLink>
      </div>
      {/* Recorte da tela: amplia o canto de cima do conteúdo e deixa a barra lateral de fora. */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-linha bg-superficie">
        <Image
          src={topic.image.src}
          alt={topic.image.alt}
          width={CAPTURE.width}
          height={CAPTURE.height}
          sizes="(min-width: 768px) 820px, 170vw"
          className="absolute top-0 -left-[36%] h-auto w-[190%] max-w-none"
        />
      </div>
    </div>
  );
}

/**
 * Mapa da solução: a logo BASE8 (com a bola no lugar do 8) no centro e os cinco tópicos em volta,
 * ligados a ele por linhas (desktop). Cada tópico expande num painel que
 * explica como aquilo é entregue. Ao entrar na tela, a logo pousa, as linhas
 * saem das letras e as etiquetas aparecem, com formas da marca em volta
 * (`SolutionShapes`). No celular, a logo vai em cima e os
 * tópicos viram uma lista.
 */
export function SolutionMap({ topics, eyebrow }: SolutionMapProps) {
  return (
    <MapStage className="relative mx-auto flex max-w-[1120px] flex-col items-center gap-10 lg:block lg:h-[460px]">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden size-full text-desativado lg:block"
      >
        {topics.map((topic, index) => (
          <LineReveal key={topic.id} line={slots[topic.id].line} index={index} />
        ))}
      </svg>

      {/* No desktop a logo ocupa o miolo do mapa; a largura em % mantém a folga até as etiquetas. */}
      <LogoReveal className="w-full max-w-[420px] lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[40%] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-[54%] xl:w-[44%]">
        <Base8Logo hasBallSpin />
      </LogoReveal>

      {/* No celular, uma coluna de pílulas da mesma largura; no desktop, cada uma no seu lugar do mapa. */}
      <ul className="flex w-full max-w-[420px] flex-col gap-3 lg:contents">
        {topics.map((topic, index) => (
          <PillReveal key={topic.id} index={index} className={cn("lg:absolute", slots[topic.id].position)}>
            <ExpandPillPanel
              label={topic.label}
              accent={topic.accent}
              eyebrow={eyebrow}
              title={topic.label}
              className="w-full lg:w-auto"
            >
              <TopicDetails topic={topic} />
            </ExpandPillPanel>
          </PillReveal>
        ))}
      </ul>
    </MapStage>
  );
}
