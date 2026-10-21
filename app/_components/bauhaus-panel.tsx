import { cn } from "@/lib/utils";

/** Lado do herói — cada um tem uma composição e uma cor de fundo. */
export type BauhausPanelSide = "esquerda" | "direita";

type BauhausPanelProps = {
  side: BauhausPanelSide;
  className?: string;
};

/**
 * Ilustração PROVISÓRIA da Landing, em escala grande: painel em arco com fundo
 * suave do pilar e formas geométricas em multiply (mesma ideia da Home). Sai
 * quando as ilustrações da campanha estiverem prontas.
 */
export function BauhausPanel({ side, className }: BauhausPanelProps) {
  const isLeft = side === "esquerda";

  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center overflow-hidden",
        isLeft ? "rounded-t-[999px] bg-trilha/30" : "rounded-b-[999px] bg-comunidade/15",
        className,
      )}
    >
      <svg viewBox="0 0 200 260" className="h-full w-full">
        {isLeft ? (
          <g className="mix-blend-multiply">
            <circle cx="92" cy="128" r="66" className="fill-trilha" />
            <rect x="96" y="54" width="72" height="72" className="fill-pratica opacity-90" />
            <path d="M24 236 L112 236 L68 160 Z" className="fill-comunidade opacity-90" />
            <rect x="128" y="196" width="44" height="12" className="fill-texto" />
          </g>
        ) : (
          <g className="mix-blend-multiply">
            <path d="M20 170 A80 80 0 0 1 180 170 Z" className="fill-comunidade opacity-90" />
            <circle cx="138" cy="84" r="38" className="fill-pratica opacity-90" />
            <rect x="34" y="40" width="58" height="58" rx="3" className="fill-trilha" />
            <path d="M60 236 L140 236 L100 196 Z" className="fill-trilha" />
          </g>
        )}
      </svg>
    </div>
  );
}
