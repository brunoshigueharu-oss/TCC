import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  current: number;
  labels: string[];
};

/**
 * Indicador de passos (Figma: "Passo 1 de 3"): um segmento por passo, com o
 * rótulo embaixo. Passos feitos e o atual ficam em verde-água.
 */
export function StepIndicator({ current, labels }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-texto-secundario">
        Passo {current} de {labels.length}
      </p>
      <ol className="grid grid-flow-col gap-1.5" aria-label="Passos do onboarding">
        {labels.map((label, index) => {
          const position = index + 1;
          const isCurrent = position === current;
          const isReached = position <= current;

          return (
            <li key={label} aria-current={isCurrent ? "step" : undefined} className="flex flex-col gap-1.5">
              <span
                aria-hidden
                className={cn("h-1.5 rounded-full", isReached ? "bg-acao" : "bg-superficie-forte")}
              />
              <span
                className={cn(
                  "text-xs leading-tight",
                  isCurrent ? "font-semibold text-texto" : "text-texto-secundario",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
