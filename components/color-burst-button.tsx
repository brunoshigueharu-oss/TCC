"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { usePointerOffset } from "@/hooks/use-pointer-offset";
import { cn } from "@/lib/utils";
import { brandButtonVariants, type BrandButtonVariantProps } from "./brand-button-variants";
import { InkBurst } from "./ink-burst";

/** Quanto (px) a tinta pode ser puxada a partir do centro do botão. */
const MAX_POINTER_OFFSET_PX = 36;

type ColorBurstButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> &
  BrandButtonVariantProps;

/**
 * Botão de formulário no padrão do CTA da Landing (pílula; primário com tinta
 * no hover). Por baixo é o `Button` do shadcn, então mantém foco, `disabled`
 * e `type` como de costume.
 */
export function ColorBurstButton({
  variant = "primary",
  size,
  className,
  children,
  ...props
}: ColorBurstButtonProps) {
  const pointerHandlers = usePointerOffset<HTMLButtonElement>(MAX_POINTER_OFFSET_PX);
  const isPrimary = variant === "primary";

  return (
    <Button
      className={cn(
        // Zera o visual padrão do shadcn (borda, raio, cor) antes do nosso.
        "border-0 bg-clip-border",
        brandButtonVariants({ variant, size }),
        className,
      )}
      {...(isPrimary ? pointerHandlers : {})}
      {...props}
    >
      {isPrimary ? <InkBurst /> : null}
      {children}
    </Button>
  );
}
