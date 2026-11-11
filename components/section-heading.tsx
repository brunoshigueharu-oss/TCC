import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { toneBg, type Tone } from "@/lib/tones";

type SectionHeadingProps = {
  id: string;
  title: string;
  /** Mantido por compatibilidade; o título editorial não mostra ícone. */
  icon?: LucideIcon;
  tone: Tone;
  /** Quando existe, o título vira link para a área (com seta). */
  href?: string;
  /** Texto curto à direita, em mono (ex.: "02 / 06", "esta semana"). */
  meta?: string;
  className?: string;
};

/**
 * Título de seção editorial: marcador pequeno na cor do pilar + rótulo em
 * caixa alta, sobre uma linha fina. Mesmo desenho da faixa da vitrine da
 * Landing. Fica fora do cartão, alinhado ao gutter de 16px (`px-4`).
 */
export function SectionHeading({ id, title, tone, href, meta, className }: SectionHeadingProps) {
  const label = (
    <>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-[2px]", toneBg[tone])} />
      {title}
    </>
  );
  const labelClass = "flex min-h-11 items-center gap-2.5 text-xs font-semibold tracking-[0.08em] uppercase";

  return (
    <div className={cn("mx-4 flex items-center justify-between gap-4 border-b border-linha lg:mx-0", className)}>
      <h2 id={id} className="min-w-0">
        {href ? (
          <Link href={href} className={cn(labelClass, "group outline-none focus-visible:underline")}>
            {label}
            <ArrowUpRight
              aria-hidden
              className="size-3.5 text-texto-secundario transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto"
              strokeWidth={2}
            />
          </Link>
        ) : (
          <span className={labelClass}>{label}</span>
        )}
      </h2>
      {meta ? (
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-texto-secundario">{meta}</span>
      ) : null}
    </div>
  );
}
