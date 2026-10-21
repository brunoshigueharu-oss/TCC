/**
 * Ilustração PROVISÓRIA do resultado: formas Bauhaus em multiply, com o rosa
 * do Praticar em destaque. Sai quando as ilustrações da campanha chegarem.
 */
export function PracticeShapes({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      <g className="mix-blend-multiply">
        <circle cx="62" cy="56" r="34" className="fill-pratica opacity-90" />
        <rect x="18" y="62" width="38" height="38" rx="2" className="fill-trilha" />
        <path d="M70 104 L104 104 L87 74 Z" className="fill-comunidade opacity-90" />
      </g>
    </svg>
  );
}
