"use client";

import { AsciiBloom } from "@/app/_components/ascii-bloom";
import { useIsDarkTheme } from "@/components/theme-toggle";

/**
 * Flor desenhada em caracteres (a assinatura visual da marca), já ajustada ao
 * tema. Decorativa; use em telas de exceção (404, erro) e vazios grandes.
 * O `key` reinicia a animação quando o tema troca, porque as cores do
 * caractere dependem do fundo.
 */
export function AsciiFlourish({ className }: { className?: string }) {
  const isDark = useIsDarkTheme();
  const page = isDark ? "dark" : "light";

  return <AsciiBloom key={page} flower="florescer" src="/entrada/florescer.mp4" page={page} className={className} />;
}
