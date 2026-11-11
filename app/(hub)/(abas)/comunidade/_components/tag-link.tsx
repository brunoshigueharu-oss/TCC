import Link from "next/link";

import { cn } from "@/lib/utils";

type TagLinkProps = {
  slug: string;
  className?: string;
};

/** Tag sóbria: `#slug` em mono, sem cápsula. O sublinhado cresce no hover. */
export function TagLink({ slug, className }: TagLinkProps) {
  return (
    <Link
      href={`/comunidade/tags/${slug}`}
      className={cn(
        "relative z-10 -my-2 inline-flex min-h-9 items-center rounded-sm font-mono text-xs text-texto-secundario underline decoration-transparent underline-offset-4 outline-none transition-colors duration-200 hover:text-texto hover:decoration-current focus-visible:ring-2 focus-visible:ring-texto",
        className,
      )}
    >
      #{slug}
    </Link>
  );
}
