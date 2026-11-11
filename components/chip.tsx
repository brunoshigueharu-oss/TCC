import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ChipProps = ComponentProps<typeof Link> & {
  isActive?: boolean;
};

/**
 * Filtro/tag em cápsula. Ativo = pílula escura (inverte com o tema). A
 * cápsula tem 36px, mas a área de toque sobe para 44px (`after`).
 */
export function Chip({ isActive = false, className, ...props }: ChipProps) {
  return (
    <Link
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "relative flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap outline-none transition-[color,background-color,box-shadow,transform] duration-200 after:absolute after:-inset-y-1 after:inset-x-0 focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 focus-visible:ring-offset-fundo active:scale-[0.97]",
        isActive
          ? "bg-texto text-fundo"
          : "bg-fundo text-texto-secundario ring-1 ring-linha hover:bg-superficie hover:text-texto hover:ring-desativado",
        className,
      )}
      {...props}
    />
  );
}
