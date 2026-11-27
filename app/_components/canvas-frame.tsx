import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Ritmo da entrada: a duração do fade (sombra, canvas e pôster) e a espera do
 * pôster para sair, igual à duração, para ele só sumir com o canvas já inteiro
 * por cima (classes literais).
 */
const FADES = {
  normal: { duration: "duration-500", afterFade: "delay-500" },
  slow: { duration: "duration-700", afterFade: "delay-700" },
} as const;

type CanvasFrameProps = {
  /** O canvas já desenha pronto: sombra e canvas aparecem juntos, com fade. */
  isReady: boolean;
  /** Posição, tamanho, cor e desfoque da sombra de contato (classes Tailwind literais). */
  shadowClassName: string;
  /** Ritmo do fade de entrada (ver `FADES`). */
  fade?: keyof typeof FADES;
  /**
   * Imagem estática do objeto, no mesmo lugar e tamanho dele no canvas,
   * mostrada (com a sombra) enquanto o canvas não fica pronto. Decorativa.
   */
  poster?: ReactNode;
  children: ReactNode;
};

/**
 * Moldura de um canvas 3D adiado (ver `useDeferredCanvas`): a sombra de
 * contato no "chão", o pôster opcional e a camada do canvas. Sem pôster, tudo
 * fica invisível até o canvas ficar pronto. Com pôster, ele e a sombra já
 * aparecem de cara; o canvas entra por cima com fade e o pôster sai depois,
 * sem o objeto "piscar" no meio da troca. Vai dentro de uma caixa `relative`.
 */
export function CanvasFrame({ isReady, shadowClassName, fade = "normal", poster, children }: CanvasFrameProps) {
  const { duration, afterFade } = FADES[fade];
  const hasPoster = poster !== undefined;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] transition-opacity",
          duration,
          isReady || hasPoster ? "opacity-100" : "opacity-0",
          shadowClassName,
        )}
      />
      {hasPoster ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity",
            duration,
            isReady ? cn("opacity-0", afterFade) : "opacity-100",
          )}
        >
          {poster}
        </div>
      ) : null}
      <div className={cn("absolute inset-0 transition-opacity", duration, isReady ? "opacity-100" : "opacity-0")}>
        {children}
      </div>
    </>
  );
}
