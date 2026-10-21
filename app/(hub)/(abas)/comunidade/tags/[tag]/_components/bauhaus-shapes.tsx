type BauhausShapesProps = {
  className?: string;
};

/**
 * Ilustração PROVISÓRIA da página da tag: formas geométricas em multiply,
 * no mesmo espírito da Home. Sai quando as ilustrações da campanha chegarem.
 */
export function BauhausShapes({ className }: BauhausShapesProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      <g className="mix-blend-multiply">
        <rect x="18" y="20" width="44" height="44" rx="2" className="fill-comunidade opacity-90" />
        <circle cx="74" cy="66" r="30" className="fill-trilha" />
        <path d="M30 104 L66 104 L48 72 Z" className="fill-pratica opacity-90" />
      </g>
    </svg>
  );
}
