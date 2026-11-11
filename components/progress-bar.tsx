import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** Cor de pilar usada no preenchimento (Figma: cor/trilha, cor/pratica, ...). */
export type ProgressTone = "trilha" | "pratica" | "comunidade" | "acao";

/**
 * Padrão = cápsula fina (cantos arredondados). "square" = régua reta, boa
 * para encostar em linhas e bordas.
 */
export type ProgressShape = "rounded" | "square";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const toneClasses: Record<ProgressTone, string> = {
  trilha: "bg-trilha",
  pratica: "bg-pratica",
  comunidade: "bg-comunidade",
  acao: "bg-acao",
};

type ProgressBarProps = {
  value: number;
  max: number;
  tone?: ProgressTone;
  shape?: ProgressShape;
  /** Texto lido por leitores de tela. */
  label: string;
  /** Desliga a animação de entrada (ex.: barra que muda a cada passo). */
  isStatic?: boolean;
  className?: string;
};

type FillStyle = CSSProperties & Record<"--progress", string>;

/**
 * Barra de progresso sem contorno. O preenchimento cresce da esquerda ao
 * aparecer e desliza quando o valor muda. A altura padrão é 6px; troque pelo
 * `className` (`h-1`, `h-0.5`).
 */
export function ProgressBar({
  value,
  max,
  tone = "trilha",
  shape = "rounded",
  label,
  isStatic = false,
  className,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const fillStyle: FillStyle = { "--progress": `${(clamped / safeMax) * 100}%` };

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      className={cn(
        "block h-1.5 w-full overflow-hidden bg-superficie-forte",
        shape === "rounded" && "rounded-full",
        className,
      )}
    >
      <span
        style={fillStyle}
        className={cn(
          "block h-full w-(--progress) origin-left transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          shape === "rounded" && "rounded-full",
          !isStatic && "animate-progress-in",
          toneClasses[tone],
        )}
      />
    </div>
  );
}
