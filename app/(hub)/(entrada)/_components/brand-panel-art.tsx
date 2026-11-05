"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { AsciiBloom } from "@/app/_components/ascii-bloom";

import { parsePosition } from "../_lib/parse-position";
import { AsciiBetta } from "./ascii-betta";
import { AsciiGatinho } from "./ascii-gatinho";

/** Passos do onboarding com desenho próprio. */
const STEP = { objective: 1, area: 2 } as const;

type BrandPanelArtProps = {
  className?: string;
};

/**
 * Desenho de caracteres do painel de marca. O painel fica no layout (não
 * remonta entre telas), então lê a rota: no onboarding, o passo "Objetivo"
 * mostra o gatinho e o "Área de atuação", a flor desabrochando; nas outras
 * telas, o betta.
 */
export function BrandPanelArt({ className }: BrandPanelArtProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = pathname === "/onboarding" ? parsePosition(searchParams.get("passo") ?? undefined, Infinity) : null;

  if (step === STEP.objective) return <AsciiGatinho src="/entrada/gatinho2.mp4" className={className} />;
  if (step === STEP.area) {
    return <AsciiBloom flower="florescer" src="/entrada/florescer.mp4" page="dark" className={className} />;
  }
  return <AsciiBetta src="/entrada/betta.mp4" className={className} />;
}
