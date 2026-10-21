import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { toneBg, type Tone } from "@/lib/tones";

type SectionHeadingProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  tone: Tone;
  /** Quando existe, o título vira link para a área (com chevron). */
  href?: string;
  className?: string;
};

/**
 * Título de seção no padrão da Home: quadradinho na cor do pilar + título.
 * Fica fora do cartão, alinhado ao gutter de 16px (`px-4`).
 */
export function SectionHeading({ id, title, icon: Icon, tone, href, className }: SectionHeadingProps) {
  const content = (
    <>
      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", toneBg[tone])}>
        <Icon aria-hidden className="size-4 text-texto" strokeWidth={2} />
      </span>
      {title}
      {href ? <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} /> : null}
    </>
  );
  const rowClass = "flex min-h-11 items-center gap-3 text-[15px] font-semibold";

  return (
    <h2 id={id} className={cn("px-4 lg:px-0", className)}>
      {href ? (
        <Link href={href} className={rowClass}>
          {content}
        </Link>
      ) : (
        <span className={rowClass}>{content}</span>
      )}
    </h2>
  );
}
