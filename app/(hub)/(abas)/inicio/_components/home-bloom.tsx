"use client";

import { AsciiBloom } from "@/app/_components/ascii-bloom";
import { useIsDarkTheme } from "@/components/theme-toggle";

type HomeBloomProps = {
  className?: string;
};

/**
 * Flor de caracteres ao lado da saudação — a assinatura visual da marca, no
 * lugar do banner ilustrado. Segue o tema: no escuro os caracteres clareiam.
 */
export function HomeBloom({ className }: HomeBloomProps) {
  const isDark = useIsDarkTheme();

  return (
    <AsciiBloom
      // Remonta ao trocar de tema: as cores dos caracteres dependem do fundo.
      key={isDark ? "escuro" : "claro"}
      flower="florescer"
      src="/entrada/florescer.mp4"
      page={isDark ? "dark" : "light"}
      className={className}
    />
  );
}
