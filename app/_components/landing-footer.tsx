import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import type { LandingData } from "@/lib/data/landing";

type LandingFooterProps = {
  footer: LandingData["footer"];
};

const linkClass =
  "relative w-fit text-sm text-texto-secundario outline-none transition-colors hover:text-texto focus-visible:text-texto after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-texto after:transition-[width] after:duration-300 hover:after:w-full focus-visible:after:w-full";

/**
 * Rodapé editorial: marca e frase à esquerda, colunas de links à direita e,
 * embaixo, a palavra BASE8 em tamanho de cartaz cortando a página.
 */
export function LandingFooter({ footer }: LandingFooterProps) {
  return (
    <footer className="overflow-hidden border-t border-linha bg-fundo">
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-4 pt-14 sm:px-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10 lg:px-16 lg:pt-20">
        <div className="flex flex-col gap-3">
          <BrandMark href="/" className="w-fit" />
          <p className="max-w-[32ch] text-sm leading-relaxed text-texto-secundario">{footer.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.08em] uppercase">{column.title}</p>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.label} className="flex min-h-9 items-center">
                    {link.href ? (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-desativado">
                        {link.label}
                        <span className="font-mono text-[10px] tracking-normal">em breve</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-14 flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-linha px-4 py-5 font-mono text-[11px] text-texto-secundario sm:px-10 lg:mt-20 lg:px-16">
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
