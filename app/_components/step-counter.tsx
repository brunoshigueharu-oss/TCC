import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

type StepCounterProps = {
  /** Posição atual, começando em 0. */
  index: number;
  count: number;
  className?: string;
};

/** "01 / 06" dos carrosséis: só visual, o leitor de tela já ouve o nome do item. */
export function StepCounter({ index, count, className }: StepCounterProps) {
  return (
    <span aria-hidden className={cn("text-xs font-medium tabular-nums text-texto-secundario", className)}>
      {formatTwoDigits(index + 1)} / {formatTwoDigits(count)}
    </span>
  );
}
