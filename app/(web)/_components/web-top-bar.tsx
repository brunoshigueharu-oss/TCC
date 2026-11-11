import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { ColorBurstLink } from "@/components/color-burst-link";
import { CommandPaletteTrigger } from "@/components/command-palette/command-palette-trigger";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Barra superior das telas de computador: marca e rótulo da área à esquerda,
 * busca (paleta ⌘K), tema e a volta para o app à direita. Translúcida, com
 * linha fina embaixo.
 */
export function WebTopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-linha bg-fundo/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 lg:px-10">
        <BrandMark href="/inicio" />
        <span aria-hidden className="hidden h-5 w-px bg-linha sm:block" />
        <span className="hidden font-mono text-[11px] tracking-wide text-texto-secundario uppercase sm:block">
          Ferramentas
        </span>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <CommandPaletteTrigger className="hidden w-60 md:flex" />
          <CommandPaletteTrigger variant="icon" className="md:hidden" />
          <ThemeToggle />
          <ColorBurstLink href="/inicio" variant="secondary" size="sm" className="ml-1">
            <ArrowLeft aria-hidden strokeWidth={2} />
            <span className="hidden sm:inline">Voltar ao app</span>
            <span className="sm:hidden">App</span>
          </ColorBurstLink>
        </div>
      </div>
    </header>
  );
}
