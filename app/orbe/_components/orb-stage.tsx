"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

import type { OrbData } from "@/lib/data/orbe";
import { formatTwoDigits } from "@/lib/format";
import { ORB_LAST_STAGE } from "@/lib/orb/orb-timeline";
import { cn } from "@/lib/utils";

// three.js só entra no navegador, e só nesta página.
const OrbCanvas = dynamic(() => import("./orb-canvas").then((module) => module.OrbCanvas), { ssr: false });

type OrbStageProps = {
  data: OrbData;
};

/**
 * Palco do render 3D: uma trilha alta de rolagem com o objeto preso no meio da
 * tela. Rolar a página avança a transformação; a legenda mostra em qual dos
 * cinco objetos ela está.
 */
export function OrbStage({ data }: OrbStageProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (scrolled) => {
    const progress = scrolled * ORB_LAST_STAGE;
    progressRef.current = progress;
    setActiveIndex(Math.round(progress));
  });

  return (
    // Uma tela para o primeiro objeto e pouco mais de uma por transformação.
    <div ref={trackRef} className="relative h-[540dvh]">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <OrbCanvas progressRef={progressRef} isAnimated={!isReducedMotion} />
        </div>

        <ol className="absolute top-6 left-4 flex flex-col gap-1.5 sm:top-10 sm:left-10">
          {data.stages.map((stage, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={stage.id}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex items-center gap-3 text-xs font-semibold tracking-[0.08em] uppercase transition-colors duration-300",
                  isActive ? "text-texto" : "text-desativado",
                )}
              >
                <span className="font-mono font-normal tabular-nums">{formatTwoDigits(index + 1)}</span>
                <span
                  aria-hidden
                  className={cn(
                    "h-px bg-current transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive ? "w-6" : "w-2",
                  )}
                />
                {stage.name}
              </li>
            );
          })}
        </ol>

        <p
          className={cn(
            "absolute right-4 bottom-6 font-mono text-[11px] text-texto-secundario transition-opacity duration-300 sm:right-10 sm:bottom-10",
            activeIndex === 0 ? "opacity-100" : "opacity-0",
          )}
        >
          {data.hint} ↓
        </p>
      </div>
    </div>
  );
}
