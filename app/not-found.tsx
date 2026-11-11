import type { Metadata } from "next";
import Link from "next/link";

import { ActionLink } from "@/components/action-link";
import { AsciiFlourish } from "@/components/ascii-flourish";
import { BrandMark } from "@/components/brand-mark";
import { CommandPaletteTrigger } from "@/components/command-palette/command-palette-trigger";
import { HubCommandPalette } from "@/components/command-palette";

export const metadata: Metadata = { title: "Página não encontrada" };

const shortcuts = [
  { label: "Trilha", href: "/educacao", meta: "Educação" },
  { label: "Comunidade", href: "/comunidade", meta: "Perguntas e discussões" },
  { label: "Cursos da comunidade", href: "/educacao/cursos", meta: "Minicursos" },
];

/**
 * 404 editorial: número grande em mono, frase curta, a flor em caracteres
 * ao lado e três caminhos de volta. A paleta (⌘K) também funciona aqui.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-fundo font-texto text-texto">
      <header className="mx-auto flex h-16 w-full max-w-[1200px] items-center px-4 lg:px-10">
        <BrandMark href="/inicio" />
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-10 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:px-10">
        <div className="flex flex-col gap-6 animate-fade-up motion-reduce:animate-none">
          <p className="flex items-center gap-3 font-mono text-[13px] text-texto-secundario tabular-nums">
            <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
            ERRO 404 · rota não encontrada
          </p>
          <h1 className="max-w-[14ch] font-display text-[44px] leading-[0.98] font-medium tracking-[-0.05em] text-balance lg:text-[80px]">
            Esta página saiu da trilha.
          </h1>
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-texto-secundario lg:text-base">
            O endereço pode ter mudado ou a tela ainda não existe no protótipo. Escolha um caminho abaixo ou busque o que
            procura.
          </p>
          <div className="flex w-full max-w-[420px] flex-col gap-3 sm:flex-row sm:items-center">
            <ActionLink href="/inicio">Voltar para a Home</ActionLink>
            <CommandPaletteTrigger label="Buscar no BASE8" className="sm:flex-1" />
          </div>

          <nav aria-label="Caminhos sugeridos" className="mt-4 max-w-[560px]">
            <ul className="border-t border-linha">
              {shortcuts.map((shortcut, index) => (
                <li key={shortcut.href} className="border-b border-linha">
                  <Link
                    href={shortcut.href}
                    className="group flex min-h-14 items-center gap-4 outline-none focus-visible:ring-2 focus-visible:ring-texto"
                  >
                    <span className="w-6 font-mono text-[11px] text-texto-secundario tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-semibold">{shortcut.label}</span>
                    <span className="hidden text-sm text-texto-secundario sm:block">{shortcut.meta}</span>
                    <span
                      aria-hidden
                      className="text-texto-secundario transition-transform duration-200 group-hover:translate-x-1 group-hover:text-texto"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <AsciiFlourish className="hidden aspect-square w-full lg:block" />
      </main>
      <HubCommandPalette />
    </div>
  );
}
