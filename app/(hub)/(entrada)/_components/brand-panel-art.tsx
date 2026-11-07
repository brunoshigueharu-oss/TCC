"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { BETTA_SCENE } from "@/lib/ascii-betta";
import { bloomSceneFor } from "@/lib/ascii-bloom";
import { createAsciiStage, type AsciiScene, type AsciiStage } from "@/lib/ascii-engine";
import { GATINHO_SCENE } from "@/lib/ascii-gatinho";

import { parsePosition } from "../_lib/parse-position";

/** Passos do onboarding com desenho próprio. */
const STEP = { objective: 1, area: 2 } as const;

type PanelArt = { scene: AsciiScene; src: string };

const ART = {
  betta: { scene: BETTA_SCENE, src: "/entrada/betta.mp4" },
  gatinho: { scene: GATINHO_SCENE, src: "/entrada/gatinho2.mp4" },
  florescer: { scene: bloomSceneFor("florescer", "dark"), src: "/entrada/florescer.mp4" },
} satisfies Record<string, PanelArt>;

type BrandPanelArtProps = {
  className?: string;
};

/**
 * Desenho de caracteres do painel de marca. O painel fica no layout (não
 * remonta entre telas), então lê a rota: no onboarding, o passo "Objetivo"
 * mostra o gatinho e o "Área de atuação", a flor desabrochando; nas outras
 * telas, o betta. Um canvas só: ao trocar de tela, as letras de um desenho
 * se transformam no outro. Decorativo (aria-hidden).
 */
export function BrandPanelArt({ className }: BrandPanelArtProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = pathname === "/onboarding" ? parsePosition(searchParams.get("passo") ?? undefined, Infinity) : null;
  const art = step === STEP.objective ? ART.gatinho : step === STEP.area ? ART.florescer : ART.betta;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<AsciiStage | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const stage = createAsciiStage(canvas);
    stageRef.current = stage;
    return () => {
      stage.stop();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    stageRef.current?.show(art.scene, art.src);
  }, [art]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
