/**
 * Ilustração PROVISÓRIA da capa do minicurso: formas Bauhaus em multiply,
 * com o azul riso da Comunidade em destaque. Sai com as ilustrações finais.
 */
export function CourseShapes({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 100" className={className}>
      <g className="mix-blend-multiply">
        <path d="M20 96 A44 44 0 0 1 108 96 Z" className="fill-comunidade opacity-90" />
        <circle cx="112" cy="40" r="24" className="fill-pratica opacity-90" />
        <rect x="40" y="14" width="34" height="34" rx="2" className="fill-trilha" />
      </g>
    </svg>
  );
}
