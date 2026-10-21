import type { Course } from "@/lib/data/cursos";
import { cn } from "@/lib/utils";

type CourseCoverProps = {
  cover: Course["cover"];
  className?: string;
};

/**
 * Capa PROVISÓRIA do minicurso: fundo suave azul riso + formas Bauhaus em
 * multiply, no lugar da ilustração. Sai quando a campanha tiver as capas.
 */
export function CourseCover({ cover, className }: CourseCoverProps) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center bg-comunidade/15", className)}>
      <svg viewBox="0 0 120 120" className="h-[78%] w-auto">
        {cover === "circulo" ? (
          <g className="mix-blend-multiply">
            <circle cx="60" cy="60" r="38" className="fill-comunidade" />
            <rect x="18" y="66" width="36" height="36" className="fill-trilha" />
            <path d="M70 20 L106 20 L88 52 Z" className="fill-pratica opacity-90" />
          </g>
        ) : null}
        {cover === "quadrado" ? (
          <g className="mix-blend-multiply">
            <rect x="24" y="24" width="56" height="56" className="fill-comunidade" />
            <circle cx="82" cy="78" r="24" className="fill-pratica opacity-90" />
            <path d="M14 104 L50 104 L32 76 Z" className="fill-trilha" />
          </g>
        ) : null}
        {cover === "arco" ? (
          <g className="mix-blend-multiply">
            <path d="M16 96 A44 44 0 0 1 104 96 Z" className="fill-comunidade" />
            <circle cx="40" cy="38" r="18" className="fill-trilha" />
            <rect x="70" y="20" width="28" height="28" rx="2" className="fill-pratica opacity-90" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
