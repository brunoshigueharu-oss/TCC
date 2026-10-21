type ResultShapesProps = {
  isApproved: boolean;
  className?: string;
};

/**
 * Ilustração PROVISÓRIA do resultado: hexágono do selo (cheio quando
 * aprovado, só contorno quando não) com formas Bauhaus em multiply.
 */
export function ResultShapes({ isApproved, className }: ResultShapesProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      <g className="mix-blend-multiply">
        <path
          d="M60 10 L103 35 L103 85 L60 110 L17 85 L17 35 Z"
          className={isApproved ? "fill-trilha" : "fill-none stroke-desativado stroke-2"}
        />
        <circle cx="60" cy="62" r="22" className={isApproved ? "fill-acao opacity-90" : "fill-superficie-forte"} />
        <rect x="70" y="24" width="22" height="22" rx="2" className="fill-comunidade opacity-90" />
      </g>
    </svg>
  );
}
