import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { ColorBurstLink } from "@/components/color-burst-link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { LandingData } from "@/lib/data/landing";

type LandingHeaderProps = {
  nav: LandingData["nav"];
};

/**
 * Barra do topo da Landing: logo à esquerda, âncoras das seções no centro
 * (desktop) e tema, Entrar e Criar conta à direita.
 */
export function LandingHeader({ nav }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-fundo/85 backdrop-blur-md">
      {/* Largura total: logo e ações encostam nas margens, como em sites de produto. */}
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-10 md:px-16 lg:px-[72px]">
        <BrandMark href="/" />

        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative flex min-h-11 items-center px-3 text-sm font-medium text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:text-texto after:absolute after:bottom-2.5 after:left-3 after:h-px after:w-0 after:bg-texto after:transition-[width] after:duration-300 hover:after:w-[calc(100%-1.5rem)] focus-visible:after:w-[calc(100%-1.5rem)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Conta" className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle variant="icon" />
          <Link
            href="/entrar"
            className="hidden min-h-11 items-center px-2 text-sm font-semibold outline-none focus-visible:underline min-[400px]:flex"
          >
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
