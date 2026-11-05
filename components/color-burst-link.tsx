"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { usePointerOffset } from "@/hooks/use-pointer-offset";
import { cn } from "@/lib/utils";
import { brandButtonVariants, type BrandButtonVariantProps } from "./brand-button-variants";
import { InkBurst } from "./ink-burst";

/** Quanto (px) a tinta pode ser puxada a partir do centro do botão. */
const MAX_POINTER_OFFSET_PX = 36;

type ColorBurstLinkProps = ComponentProps<typeof Link> & BrandButtonVariantProps;

/**
 * Link com cara de botão, no padrão do CTA da Landing. O primário ganha a
 * tinta colorida no hover (ou foco pelo teclado), "mexida" pelo mouse.
 */
export function ColorBurstLink({
  variant = "primary",
  size,
  className,
  children,
  ...props
}: ColorBurstLinkProps) {
  const pointerHandlers = usePointerOffset<HTMLAnchorElement>(MAX_POINTER_OFFSET_PX);
  const isPrimary = variant === "primary";

  return (
    <Link
      className={cn(brandButtonVariants({ variant, size }), className)}
      {...(isPrimary ? pointerHandlers : {})}
      {...props}
    >
      {isPrimary ? <InkBurst /> : null}
      {children}
    </Link>
  );
}
