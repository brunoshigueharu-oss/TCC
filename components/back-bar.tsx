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
 * Barra de voltar das telas internas (Figma: "Barra de voltar"). Faixa branca
 * fixa no topo, sobre o fundo `superficie`. No computador, dentro das abas
 * (`data-shell="abas"`), vira um cartão arredondado como o `PageHeader`.
 */
export function BackBar({ href, label, action }: BackBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-1 bg-fundo px-2 ring-1 ring-linha/70 lg:in-data-[shell=abas]:top-4 lg:in-data-[shell=abas]:rounded-2xl lg:in-data-[shell=abas]:px-3">
      <Link href={href} aria-label="Voltar" className="flex size-11 items-center justify-center rounded-xl">
        <ArrowLeft aria-hidden className="size-[22px]" strokeWidth={1.75} />
      </Link>
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{label}</span>
      {action}
    </header>
  );
}
