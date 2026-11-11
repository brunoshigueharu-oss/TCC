import type { CoverPattern } from "@/lib/data/cursos";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

const VIEW = 100;

/** Linhas finas que formam cada padrão. Desenho em grade 100×100. */
function PatternLines({ pattern }: { pattern: CoverPattern }) {
  if (pattern === "horizontais") {
    // Espaçamento que cresce de cima para baixo, como uma escala tipográfica.
    const ys: number[] = [];
    for (let y = 4, gap = 1.6; y < VIEW; y += gap, gap *= 1.12) ys.push(y);
    return (
      <>
        {ys.map((y) => (
          <line key={y} x1="0" x2={VIEW} y1={y} y2={y} />
        ))}
      </>
    );
  }
  if (pattern === "diagonais") {
    return (
      <>
        {Array.from({ length: 34 }, (_, index) => {
          const offset = index * 6 - VIEW;
          return <line key={index} x1={offset} y1={VIEW} x2={offset + VIEW} y2="0" />;
        })}
      </>
    );
  }
  if (pattern === "ondas") {
    return (
      <>
        {Array.from({ length: 22 }, (_, index) => {
          const y = 6 + index * 4.2;
          const amplitude = 2 + (index % 5);
          return (
            <path
              key={index}
              d={`M0 ${y} C 25 ${y - amplitude}, 25 ${y + amplitude}, 50 ${y} S 75 ${y - amplitude}, 100 ${y}`}
              fill="none"
            />
          );
        })}
      </>
    );
  }
  return (
    <>
      {Array.from({ length: 11 }, (_, index) => (
        <line key={`v${index}`} x1={index * 10} x2={index * 10} y1="0" y2={VIEW} />
      ))}
      {Array.from({ length: 11 }, (_, index) => (
        <line key={`h${index}`} y1={index * 10} y2={index * 10} x1="0" x2={VIEW} />
      ))}
      <circle cx="70" cy="40" r="20" fill="none" />
    </>
  );
}

type CourseCoverProps = {
  pattern: CoverPattern;
  /** Número do minicurso na estante (aparece em mono no canto). */
  number: number;
  /** Título por cima do padrão, só nas capas grandes. */
  title?: string;
  className?: string;
};

/**
 * Capa tipográfica do minicurso: padrão de linhas finas na cor do pilar
 * (comunidade) e número em mono. Nas capas grandes o título entra por cima.
 */
export function CourseCover({ pattern, number, title, className }: CourseCoverProps) {
  return (
    <div
      aria-hidden
      className={cn("relative isolate overflow-hidden border border-linha bg-fundo text-comunidade", className)}
    >
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full stroke-current opacity-70 transition-transform duration-500 ease-out group-hover:scale-[1.04] [&_*]:[vector-effect:non-scaling-stroke]"
        strokeWidth="1"
      >
        <PatternLines pattern={pattern} />
      </svg>
      <span className="absolute top-2 left-2.5 bg-fundo px-1 font-mono text-[10px] tracking-wide text-texto tabular-nums">
        Nº {formatTwoDigits(number)}
      </span>
      {title ? (
        <span className="absolute inset-x-0 bottom-0 bg-fundo px-4 pt-3 pb-4 font-display text-[26px] leading-[1.02] font-medium tracking-[-0.035em] text-balance text-texto lg:text-[32px]">
          {title}
        </span>
      ) : null}
    </div>
  );
}
