import { useId } from "react";

import type { Badge } from "@/lib/data/pessoas";
import { cn } from "@/lib/utils";

/** Quantas marcas (de 3) cada nível acende embaixo do monograma. */
const levelMarks: Record<Badge["level"], number> = { Básico: 1, Intermediário: 2, Avançado: 3 };

const MARK_COUNT = 3;
/** Palavras que não entram no monograma ("Prompts para interfaces" → "PI"). */
const SKIPPED_WORDS = new Set(["para", "e", "de", "com", "do", "da"]);

function getMonogram(title: string) {
  const words = title.split(" ").filter((word) => !SKIPPED_WORDS.has(word.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

type ProficiencySealProps = {
  title: string;
  /** `null` = selo ainda não conquistado (contorno tracejado, sem cor). */
  level: Badge["level"] | null;
  className?: string;
};

/**
 * Selo de proficiência desenhado como um carimbo: anel fino com a legenda em
 * mono acompanhando a curva, disco central com o monograma do tema e três
 * marcas que acendem conforme o nível. No hover, a legenda gira devagar.
 */
export function ProficiencySeal({ title, level, className }: ProficiencySealProps) {
  const pathId = useId();
  const isEarned = level !== null;
  const legend = isEarned ? `Proficiência · ${level} · BASE8 · ` : "A conquistar · Teste de proficiência · ";

  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn("size-20 shrink-0", className)}>
      <defs>
        <path id={pathId} d="M 50,50 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0" />
      </defs>

      <circle
        cx="50"
        cy="50"
        r="48.5"
        className={cn("fill-none", isEarned ? "stroke-texto" : "stroke-desativado [stroke-dasharray:2_3]")}
        strokeWidth="1"
      />

      <g className="origin-center transition-transform duration-[1200ms] ease-out group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transition-none">
        <text className={cn("font-mono text-[6.4px] uppercase", isEarned ? "fill-texto-secundario" : "fill-desativado")}>
          <textPath href={`#${pathId}`} textLength="240" lengthAdjust="spacing">
            {legend}
          </textPath>
        </text>
      </g>

      <circle
        cx="50"
        cy="50"
        r="30"
        className={isEarned ? "fill-trilha" : "fill-none stroke-linha"}
        strokeWidth="1"
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className={cn("font-display text-[20px] font-medium", isEarned ? "fill-tinta" : "fill-desativado")}
      >
        {getMonogram(title)}
      </text>

      {isEarned
        ? Array.from({ length: MARK_COUNT }, (_, index) => (
            <rect
              key={index}
              x={41 + index * 7}
              y="63"
              width="4"
              height="4"
              rx="1"
              className={index < levelMarks[level] ? "fill-tinta" : "fill-none stroke-tinta"}
              strokeWidth="0.75"
            />
          ))
        : null}
    </svg>
  );
}
