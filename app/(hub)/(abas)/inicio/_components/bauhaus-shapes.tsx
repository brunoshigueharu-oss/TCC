/** Composições disponíveis — uma por cartão da Home. */
export type BauhausComposition = "semana" | "duvidas";

type BauhausShapesProps = {
  composition: BauhausComposition;
  className?: string;
};

/**
 * Ilustração PROVISÓRIA: formas geométricas em multiply, no lugar onde a
 * referência tem os bonequinhos. Sai quando as ilustrações da campanha
 * estiverem prontas.
 */
export function BauhausShapes({ composition, className }: BauhausShapesProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      {composition === "semana" ? (
        <g className="mix-blend-multiply">
          <circle cx="52" cy="58" r="34" className="fill-trilha" />
          <rect x="62" y="26" width="40" height="40" className="fill-pratica opacity-90" />
          <path d="M20 104 L58 104 L39 70 Z" className="fill-comunidade opacity-90" />
        </g>
      ) : (
        <g className="mix-blend-multiply">
          <path d="M18 92 A42 42 0 0 1 102 92 Z" className="fill-comunidade opacity-90" />
          <circle cx="78" cy="42" r="20" className="fill-pratica opacity-90" />
          <rect x="26" y="24" width="30" height="30" rx="2" className="fill-trilha" />
        </g>
      )}
    </svg>
  );
}
