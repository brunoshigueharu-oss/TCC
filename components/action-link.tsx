import type { ComponentProps } from "react";

import { ColorBurstLink } from "./color-burst-link";

type ActionLinkVariant = "primary" | "secondary";

type ActionLinkProps = ComponentProps<typeof ColorBurstLink> & {
  variant?: ActionLinkVariant;
};

/**
 * Link de ação das telas do hub, no padrão do CTA da Landing. Primário =
 * pílula azul-noite com tinta no hover (ação principal da tela, 48px);
 * secundário = pílula branca com contorno (44px).
 */
export function ActionLink({ variant = "primary", size, ...props }: ActionLinkProps) {
  return (
    <ColorBurstLink variant={variant} size={size ?? (variant === "primary" ? "md" : "sm")} {...props} />
  );
}
