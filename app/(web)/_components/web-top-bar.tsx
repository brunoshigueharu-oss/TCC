import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Barra superior das telas de computador: logo provisório (círculo cinza +
 * "código & design") e o atalho de volta para o app.
 */
export function WebTopBar() {
  return (
    <header className="sticky top-0 z-10 bg-fundo ring-1 ring-linha/70">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <span aria-hidden className="size-[26px] rounded-full bg-superficie-forte" />
          <span className="font-display text-[15px] font-bold">código &amp; design</span>
        </Link>
        <Link
          href="/inicio"
          className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold ring-1 ring-linha"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={2} />
          Voltar ao app
        </Link>
      </div>
    </header>
  );
}
