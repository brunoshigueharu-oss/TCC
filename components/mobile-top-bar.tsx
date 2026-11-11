import { BrandMark } from "@/components/brand-mark";
import { CommandPaletteTrigger } from "@/components/command-palette/command-palette-trigger";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Faixa superior das abas no celular (< lg): marca à esquerda, busca (abre a
 * paleta de comandos) e tema à direita. No computador a barra lateral faz
 * esse papel e a faixa some.
 */
export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b border-linha bg-fundo/90 pr-2 pl-4 backdrop-blur-md lg:hidden">
      <BrandMark href="/inicio" />
      <div className="flex items-center">
        <CommandPaletteTrigger variant="icon" />
        <ThemeToggle />
      </div>
    </div>
  );
}
