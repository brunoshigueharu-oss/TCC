import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { ColorBurstLink } from "@/components/color-burst-link";

/**
 * Barra superior das telas de computador, no mesmo padrão do header da
 * Landing: fundo translúcido com desfoque, logo à esquerda e o atalho de volta
 * para o app como pílula secundária.
 */
export function WebTopBar() {
  return (
    <header className="sticky top-0 z-10 bg-fundo/85 ring-1 ring-linha/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
        <BrandMark href="/" />
        <ColorBurstLink href="/inicio" variant="secondary" size="sm">
          <ArrowLeft aria-hidden strokeWidth={2} />
          Voltar ao app
        </ColorBurstLink>
      </div>
    </header>
  );
}
