import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href: string;
  className?: string;
  /** Só o "8", para espaços estreitos. */
  compact?: boolean;
};

/**
 * Marca tipográfica do BASE8: a palavra inteira em Instrument Sans apertado,
 * sem moldura. Usa só `texto`, então inverte com o tema. Na barra lateral
 * recolhida (variante `nav-recolhida`), o "BASE" some e fica o "8".
 */
export function BrandMark({ href, className, compact = false }: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="BASE8"
      className={cn(
        "flex min-h-11 w-fit items-center rounded-lg text-texto outline-none transition-opacity duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-4 focus-visible:ring-offset-fundo",
        className,
      )}
    >
      <span aria-hidden className="font-display text-[17px] leading-none font-semibold tracking-[-0.04em]">
        {compact ? null : <span className="nav-recolhida:hidden">BASE</span>}8
      </span>
    </Link>
  );
}
