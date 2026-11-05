import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ColorBurstLink } from "@/components/color-burst-link";

/** Barra do topo da Landing: logo à esquerda, Entrar e Criar conta à direita. */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-10 bg-fundo/85 backdrop-blur-md">
      {/* Largura total: logo e ações encostam nas margens, como em sites de produto. */}
      <div className="flex h-[72px] items-center justify-between gap-4 px-5 sm:px-10 md:px-16 lg:px-[72px]">
        <BrandMark href="/" />
        <nav aria-label="Conta" className="flex items-center gap-2 sm:gap-4">
          <Link href="/entrar" className="flex min-h-11 items-center px-2 text-sm font-semibold">
            Entrar
          </Link>
          {/* Mesmo efeito de tinta do CTA do herói, em tamanho de barra. */}
          <ColorBurstLink href="/cadastro" size="sm">
            Criar conta
          </ColorBurstLink>
        </nav>
      </div>
    </header>
  );
}
