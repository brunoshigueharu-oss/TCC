/**
 * Ilustração PROVISÓRIA do selo: hexágono em limão com formas Bauhaus em
 * multiply. Sai quando o selo definitivo for desenhado.
 */
export function BadgeShapes({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className}>
      <g className="mix-blend-multiply">
        <path d="M60 10 L103 35 L103 85 L60 110 L17 85 L17 35 Z" className="fill-trilha" />
        <circle cx="60" cy="62" r="22" className="fill-acao opacity-90" />
        <rect x="70" y="24" width="22" height="22" rx="2" className="fill-comunidade opacity-90" />
      </g>
    </svg>
  );
}
