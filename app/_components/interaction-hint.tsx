import { MousePointer2, Pointer } from "lucide-react";

import type { InteractionHintText } from "@/lib/data/landing";
import { cn } from "@/lib/utils";

type InteractionHintProps = {
  hint: InteractionHintText;
  className?: string;
};

/** Em tela de toque não existe "passar o mouse": o texto e o ícone trocam. */
const onlyWithMouse = "[@media(hover:none)]:hidden";
const onlyWithTouch = "hidden [@media(hover:none)]:inline-block";

/**
 * Aviso curto de que um trecho da página reage à pessoa ("passe o mouse",
 * "arraste"). Texto pequeno em caixa de frase, com o ícone do gesto.
 */
export function InteractionHint({ hint, className }: InteractionHintProps) {
  return (
    <p
      className={cn(
        "flex items-center justify-center gap-2 text-center text-sm text-texto-secundario",
        className,
      )}
    >
      <MousePointer2 aria-hidden className={cn("size-3.5 shrink-0", onlyWithMouse)} strokeWidth={2} />
      <Pointer aria-hidden className={cn("size-3.5 shrink-0", onlyWithTouch)} strokeWidth={2} />
      <span className={onlyWithMouse}>{hint.pointer}</span>
      <span className={onlyWithTouch}>{hint.touch}</span>
    </p>
  );
}
