"use client";

import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type RefObject, useId } from "react";

import { easeOutQuart } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ShapeKind = "circle" | "half" | "quarter" | "triangle" | "square" | "dots";

type ShapeSpec = {
  kind: ShapeKind;
  /** Lugar e tamanho no mapa (classes literais: o Tailwind só enxerga nomes inteiros). */
  place: string;
  /** Cor da tinta (classe literal). */
  ink: string;
  /** De onde a forma chega: deslocamento (px), giro (graus). */
  from: { x: number; y: number; rotate: number };
  /** Profundidade da paralaxe depois de montada: 0 = parada, 1 = sobe bastante. */
  depth: number;
};

/**
 * Formas da marca em volta do BASE8, nos vãos do mapa (nunca sobre texto).
 * Cores da paleta Risografia; duas se sobrepõem para a sobreimpressão
 * (limão sobre azul vira verde, rosa sobre limão vira laranja).
 */
const shapes: ShapeSpec[] = [
  {
    kind: "circle",
    place: "top-[36%] left-[3%] size-[128px]",
    ink: "text-pratica",
    from: { x: -220, y: 60, rotate: 0 },
    depth: 0.9,
  },
  {
    kind: "quarter",
    place: "top-[50%] left-[10%] size-[92px]",
    ink: "text-trilha",
    from: { x: -160, y: 160, rotate: -90 },
    depth: 0.5,
  },
  {
    kind: "circle",
    place: "top-[19%] right-[9%] size-[86px]",
    ink: "text-comunidade",
    from: { x: 200, y: -80, rotate: 0 },
    depth: 0.7,
  },
  {
    kind: "quarter",
    place: "top-[24%] right-[4%] size-[104px]",
    ink: "text-trilha",
    from: { x: 240, y: 40, rotate: 90 },
    depth: 0.35,
  },
  {
    kind: "half",
    place: "bottom-[-2%] right-[6%] h-[110px] w-[220px]",
    ink: "text-acao",
    from: { x: 120, y: 220, rotate: 24 },
    depth: 0.6,
  },
  {
    kind: "dots",
    place: "bottom-[14%] right-[22%] size-[96px]",
    ink: "text-comunidade",
    from: { x: 60, y: 160, rotate: 0 },
    depth: 1,
  },
  {
    kind: "triangle",
    place: "bottom-[2%] left-[37%] size-[72px]",
    ink: "text-comunidade",
    from: { x: -80, y: 200, rotate: -140 },
    depth: 0.8,
  },
  {
    kind: "square",
    place: "top-[4%] left-[44%] size-[26px]",
    ink: "text-pratica",
    from: { x: 0, y: -120, rotate: 180 },
    depth: 1.2,
  },
];

/** Desenho de cada forma, em `viewBox` 100×100 (meia-lua: 100×50), pintado com a cor do texto. */
function ShapeArt({ kind, filterId }: { kind: ShapeKind; filterId: string }) {
  const paint = { fill: "currentColor", filter: `url(#${filterId})` };

  switch (kind) {
    case "circle":
      return <circle cx="50" cy="50" r="50" {...paint} />;
    case "half":
      return <path d="M0 50 A50 50 0 0 1 100 50 Z" {...paint} />;
    case "quarter":
      return <path d="M0 0 H100 A100 100 0 0 1 0 100 Z" {...paint} />;
    case "triangle":
      return <path d="M50 4 L97 92 H3 Z" {...paint} />;
    case "square":
      return <rect width="100" height="100" {...paint} />;
    case "dots":
      return (
        <g {...paint}>
          {Array.from({ length: 25 }, (_, index) => (
            <circle key={index} cx={10 + (index % 5) * 20} cy={10 + Math.floor(index / 5) * 20} r="5.5" />
          ))}
        </g>
      );
  }
}

type FloatingShapeProps = {
  spec: ShapeSpec;
  progress: MotionValue<number>;
  filterId: string;
};

/** Até a metade da rolagem a forma chega e se monta; depois só sobe devagar (paralaxe). */
function FloatingShape({ spec, progress, filterId }: FloatingShapeProps) {
  const ease = [easeOutQuart, (amount: number) => amount];
  const x = useTransform(progress, [0, 0.45, 1], [spec.from.x, 0, 0], { ease });
  const y = useTransform(progress, [0, 0.45, 1], [spec.from.y, 0, -90 * spec.depth], { ease });
  const rotate = useTransform(progress, [0, 0.45, 1], [spec.from.rotate, 0, 18 * spec.depth], { ease });
  const scale = useTransform(progress, [0, 0.45], [0.5, 1], { ease: easeOutQuart });
  const opacity = useTransform(progress, [0.05, 0.25], [0, 1]);

  return (
    <motion.svg
      viewBox={spec.kind === "half" ? "0 0 100 50" : "0 0 100 100"}
      style={{ x, y, rotate, scale, opacity }}
      className={cn("absolute overflow-visible will-change-transform", spec.place, spec.ink)}
    >
      <ShapeArt kind={spec.kind} filterId={filterId} />
    </motion.svg>
  );
}

type SolutionShapesProps = {
  /** O mapa: a rolagem é medida pela passagem dele na tela. */
  targetRef: RefObject<HTMLElement | null>;
};

/**
 * Formas geométricas em risografia (tinta chapada, granulado e
 * sobreimpressão) que chegam das bordas e se montam em volta do BASE8
 * conforme o mapa entra na tela. Só no desktop, onde há vãos entre as
 * etiquetas; com movimento reduzido elas já aparecem montadas.
 */
export function SolutionShapes({ targetRef }: SolutionShapesProps) {
  const filterId = `riso-${useId().replace(/:/g, "")}`;
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const settled = useTransform(() => 0.45);
  const progress = shouldReduceMotion ? settled : smooth;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden mix-blend-multiply lg:block dark:mix-blend-screen"
    >
      {/* Textura da tinta: o ruído fura a forma em pontinhos, como a risografia no papel. */}
      <svg className="absolute size-0">
        <filter id={filterId} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="8" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.15"
            result="speckle"
          />
          <feComposite in="SourceGraphic" in2="speckle" operator="in" />
        </filter>
      </svg>
      {shapes.map((spec, index) => (
        <FloatingShape key={index} spec={spec} progress={progress} filterId={filterId} />
      ))}
    </div>
  );
}
