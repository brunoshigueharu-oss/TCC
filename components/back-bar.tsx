import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type BackBarProps = {
  href: string;
  /** Onde a pessoa está, ex.: "Trilha · Módulo 1". */
  label: string;
  /** Ação opcional à direita (ex.: menu do post). */
  action?: ReactNode;
};

/**
 * Barra de voltar das telas internas: faixa fixa no topo, translúcida, com
 * uma linha fina embaixo. A seta anda 2px para a esquerda no hover. Dentro
 * das abas no computador (`data-shell="abas"`) perde o respiro lateral, porque
 * a coluna já tem o seu.
 */
export function BackBar({ href, label, action }: BackBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 border-b border-linha bg-fundo/90 px-2 backdrop-blur-md lg:in-data-[shell=abas]:-mx-2">
      <Link
        href={href}
        aria-label="Voltar"
        className="group flex size-11 shrink-0 items-center justify-center rounded-full text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:bg-superficie-forte"
      >
        <ArrowLeft
          aria-hidden
          className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={1.75}
        />
      </Link>
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{label}</span>
      {action}
    </header>
  );
}
