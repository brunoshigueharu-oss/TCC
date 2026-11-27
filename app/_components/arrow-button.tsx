import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type ArrowButtonProps = {
  direction: -1 | 1;
  /** Nome acessível ("Peça anterior", "Próxima área"...). */
  label: string;
  onStep: (direction: -1 | 1) => void;
  className?: string;
};

/**
 * Seta redonda dos carrosséis da landing (palco e hub). Translúcida para
 * poder ficar por cima das telas do hub sem esconder o que está atrás.
 */
export function ArrowButton({ direction, label, onStep, className }: ArrowButtonProps) {
  const Icon = direction < 0 ? ArrowLeft : ArrowRight;
  const handleClick = () => onStep(direction);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full border border-linha bg-fundo/80 text-texto outline-none backdrop-blur-sm transition-[background-color,border-color,scale] duration-200 hover:border-texto hover:bg-fundo focus-visible:ring-2 focus-visible:ring-texto active:scale-95",
        className,
      )}
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.5} />
    </button>
  );
}
