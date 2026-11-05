import { Suspense } from "react";

import { BrandMark } from "@/components/brand-mark";
import { BrandPanelArt } from "./brand-panel-art";

/**
 * Painel de marca das telas de entrada no computador (`lg`): metade esquerda
 * da tela dividida, fundo preto com o logo no topo e um desenho de caracteres
 * ao centro (betta; no onboarding, gatinho no passo "Objetivo" e flor no
 * "Área de atuação").
 * Fica oculto no celular, onde o `BrandHeader` faz esse papel.
 */
export function BrandPanel() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[44%] shrink-0 flex-col overflow-hidden bg-black p-10 text-white lg:flex xl:w-1/2">
      {/* lê `?passo=` da URL: sem Suspense, o layout inteiro deixaria de ser estático */}
      <Suspense>
        <BrandPanelArt className="absolute inset-0 size-full" />
      </Suspense>
      <BrandMark href="/" className="relative self-start" />
    </aside>
  );
}
