import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ActionLinkVariant = "primary" | "secondary";

const variantClasses: Record<ActionLinkVariant, string> = {
  primary: "h-12 bg-acao px-5 text-[15px]",
  secondary: "h-11 bg-fundo px-4 text-sm ring-1 ring-linha",
};

type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: ActionLinkVariant;
};

/**
 * Link com cara de botão (Figma: "Botão · ..."). Primário = verde-água com
 * texto azul-noite, ação principal da tela; secundário = branco com contorno.
 */
export function ActionLink({ variant = "primary", className, ...props }: ActionLinkProps) {
  return (
    <Link
      className={cn(
        "flex items-center justify-center rounded-xl font-semibold text-texto transition-transform active:scale-[0.98]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
