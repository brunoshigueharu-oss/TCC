import Link from "next/link";

import { ActionLink } from "@/components/action-link";
import { BrandMark } from "./brand-mark";

/** Barra do topo da Landing: logo à esquerda, Entrar e Criar conta à direita. */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-10 bg-fundo ring-1 ring-linha/70">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 lg:px-10">
        <BrandMark href="/" />
        <nav aria-label="Conta" className="flex items-center gap-2 sm:gap-4">
          <Link href="/entrar" className="flex min-h-11 items-center px-2 text-sm font-semibold">
            Entrar
          </Link>
          <ActionLink href="/cadastro" variant="secondary">
            Criar conta
          </ActionLink>
        </nav>
      </div>
    </header>
  );
}
