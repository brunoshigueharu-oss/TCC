"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

import type { ViewportPreset } from "@/lib/data/viewport-presets";

type ViewportFrameProps = {
  preset: ViewportPreset;
  /** Rota carregada no iframe ao abrir; trocar de tamanho não recarrega. */
  src: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
};

type FrameStyle = CSSProperties & Record<`--${string}`, string>;

/**
 * Mostra o site num iframe com a largura e altura exatas do preset, reduzido
 * para caber na janela. Como o iframe tem a largura real, os breakpoints
 * (`lg:` etc.) reagem como num aparelho de verdade.
 */
export function ViewportFrame({ preset, src, iframeRef }: ViewportFrameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setStage({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scale = stage
    ? Math.min(1, stage.width / preset.width, stage.height / preset.height)
    : 1;

  const frameStyle: FrameStyle = {
    "--frame-w": `${preset.width * scale}px`,
    "--frame-h": `${preset.height * scale}px`,
    "--frame-scale": String(scale),
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overscroll-contain bg-neutral-800 text-white">
      <div className="flex h-14 shrink-0 items-center gap-2 pr-16 pl-4 text-sm">
        <span className="font-semibold">{preset.label}</span>
        <span className="text-white/60 tabular-nums">
          {preset.width} × {preset.height}
        </span>
        {scale < 1 && (
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/70 tabular-nums">
            {Math.round(scale * 100)}%
          </span>
        )}
      </div>
      <div ref={stageRef} className="flex min-h-0 flex-1 items-center justify-center px-6 pb-6">
        <div
          style={frameStyle}
          className="h-(--frame-h) w-(--frame-w) shrink-0 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-white/15"
        >
          <iframe
            ref={iframeRef}
            src={src}
            title={`Pré-visualização em ${preset.label}`}
            width={preset.width}
            height={preset.height}
            className="origin-top-left border-0 [transform:scale(var(--frame-scale))]"
          />
        </div>
      </div>
    </div>
  );
}
