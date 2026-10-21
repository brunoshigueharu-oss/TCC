import { cn } from "@/lib/utils";

/** Cor de pilar usada no preenchimento (Figma: cor/trilha, cor/pratica, ...). */
export type ProgressTone = "trilha" | "pratica" | "comunidade" | "acao";

/**
 * Padrão = cápsula fina (cantos arredondados, estilo Spotify). "square" fica
 * disponível para casos pontuais.
 */
export type ProgressShape = "rounded" | "square";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const toneClasses: Record<ProgressTone, string> = {
  trilha: "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-trilha [&::-moz-progress-bar]:bg-trilha",
  pratica: "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-pratica [&::-moz-progress-bar]:bg-pratica",
  comunidade: "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-comunidade [&::-moz-progress-bar]:bg-comunidade",
  acao: "[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-acao [&::-moz-progress-bar]:bg-acao",
};

const shapeClasses: Record<ProgressShape, string> = {
  rounded: "h-1.5 overflow-hidden rounded-full",
  square: "h-1.5",
};

type ProgressBarProps = {
  value: number;
  max: number;
  tone?: ProgressTone;
  shape?: ProgressShape;
  /** Texto lido por leitores de tela. */
  label: string;
  className?: string;
};

/** Barra de progresso sem contorno, no estilo das telas do hub. */
export function ProgressBar({
  value,
  max,
  tone = "trilha",
  shape = "rounded",
  label,
  className,
}: ProgressBarProps) {
  return (
    <progress
      value={value}
      max={max}
      aria-label={label}
      className={cn(
        "block w-full appearance-none bg-superficie-forte",
        "[&::-webkit-progress-bar]:bg-superficie-forte",
        shapeClasses[shape],
        toneClasses[tone],
        className,
      )}
    />
  );
}
