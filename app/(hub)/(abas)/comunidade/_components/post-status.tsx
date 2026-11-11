import { Check } from "lucide-react";

import type { PostType } from "@/lib/data/comunidade";
import { cn } from "@/lib/utils";

type PostStatusProps = {
  type: PostType;
  isSolved: boolean;
  answersCount: number;
  className?: string;
};

/**
 * Estado do post em caixa alta: "Resolvida" (quadrado verde-água com o
 * visto), "Aberta" / "Sem resposta" (quadrado vazado) ou "Discussão".
 * A cor fica só no marcador; o texto mantém o contraste.
 */
export function PostStatus({
  type,
  isSolved,
  answersCount,
  className,
}: PostStatusProps) {
  const label =
    type === "discussao"
      ? "Discussão"
      : isSolved
        ? "Resolvida"
        : answersCount === 0
          ? "Sem resposta"
          : "Aberta";

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase",
        isSolved ? "text-texto" : "text-texto-secundario",
        className,
      )}
    >
      {isSolved ? (
        <span
          aria-hidden
          className="flex size-3 items-center justify-center rounded-[3px] bg-acao text-tinta"
        >
          <Check className="size-2.5" strokeWidth={3.5} />
        </span>
      ) : (
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-[2px]",
            type === "discussao"
              ? "bg-comunidade"
              : "ring-1 ring-texto-secundario ring-inset",
          )}
        />
      )}
      {label}
    </span>
  );
}
