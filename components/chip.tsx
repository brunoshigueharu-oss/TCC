import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ChipProps = ComponentProps<typeof Link> & {
  isActive?: boolean;
};

/** Filtro/tag em cápsula. Ativo = azul-noite com texto branco. */
export function Chip({ isActive = false, className, ...props }: ChipProps) {
  return (
    <Link
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "flex h-9 shrink-0 items-center rounded-full px-4 whitespace-nowrap text-sm font-semibold transition-colors",
        isActive ? "bg-texto text-fundo" : "bg-fundo text-texto ring-1 ring-linha",
        className,
      )}
      {...props}
    />
  );
}
