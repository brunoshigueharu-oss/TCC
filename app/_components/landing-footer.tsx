import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import type { LandingData } from "@/lib/data/landing";

type LandingFooterProps = {
  footer: LandingData["footer"];
  /** Âncoras das seções (as mesmas do header), na primeira coluna. */
  nav: LandingData["nav"];
};

/**
 * Link do rodapé: o texto fica do tamanho da letra, mas o `before` estica a
 * área de toque para a altura toda da linha (44px), sem mudar o visual.
 */
const linkClass =
  "relative w-fit before:absolute before:-inset-x-1 before:-inset-y-3 text-sm text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:text-texto after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-texto after:transition-[width] after:duration-300 hover:after:w-full focus-visible:after:w-full";

/**
 * Rodapé editorial: marca e frase à esquerda, colunas de links à direita e,
 * embaixo, a palavra BASE8 em tamanho de cartaz cortando a página.
 */
export function LandingFooter({ footer, nav }: LandingFooterProps) {
  const sectionsColumn = {
    title: footer.sectionsTitle,
    links: nav.map((item) => ({ label: item.label, href: `#${item.sectionId}` })),
  };
  const columns = [sectionsColumn, ...footer.columns];

  return (
    <footer className="overflow-hidden border-t border-linha bg-fundo">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 pt-14 sm:px-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10 lg:px-16 lg:pt-20">
        <div className="flex flex-col gap-3">
          <BrandMark href="/" className="w-fit" />
          <p className="max-w-[32ch] text-sm leading-relaxed text-pretty text-texto-secundario">{footer.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label} className="flex min-h-11 items-center">
                    {link.href ? (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-texto-secundario">
                        {link.label}
                        <span className="shrink-0 rounded-full border border-linha px-2 py-0.5 text-xs whitespace-nowrap">em breve</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-linha px-4 py-5 text-xs text-texto-secundario sm:px-10 lg:mt-20 lg:px-16">
        <span>{footer.note}</span>
        <span className="tabular-nums">© 2026 BASE8</span>
      </div>

      {/* Assinatura em tamanho de cartaz; a base das letras é cortada pela borda da página. */}
      <p
        aria-hidden
        className="mx-auto -mb-[0.2em] max-w-[1280px] px-2 text-center font-display text-[clamp(96px,27vw,380px)] leading-[0.8] font-medium tracking-[-0.07em] text-superficie-forte select-none"
      >
        BASE8
      </p>
    </footer>
  );
}
