import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href: string;
  className?: string;
  /** Só o monograma (o "8" no quadrado), para espaços estreitos. */
  compact?: boolean;
};

/**
 * Marca tipográfica do BASE8: "BASE" em Instrument Sans apertado e o "8" em
 * mono dentro de um quadrado de linha fina — o algarismo como unidade, como
 * num dígito de contador. Usa só `texto`/`fundo`, então inverte com o tema.
 * Na barra lateral recolhida (variante `nav-recolhida`), o "BASE" some e fica
 * o monograma.
 */
export function BrandMark({ href, className, compact = false }: BrandMarkProps) {
  return (
    <Link
      href={href}
      aria-label="BASE8"
      className={cn(
        "group/brand flex min-h-11 w-fit items-center gap-1.5 rounded-lg text-texto outline-none focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-4 focus-visible:ring-offset-fundo",
        className,
      )}
    >
      {compact ? null : (
        <span
          aria-hidden
          className="font-display text-[17px] leading-none font-semibold tracking-[-0.04em] nav-recolhida:hidden"
        >
          BASE
        </span>
      )}
      <span
        aria-hidden
        className="flex size-[22px] items-center justify-center rounded-[5px] border border-texto font-mono text-[13px] leading-none font-medium transition-colors duration-200 group-hover/brand:bg-texto group-hover/brand:text-fundo"
      >
        8
      </span>
    </Link>
  );
}
