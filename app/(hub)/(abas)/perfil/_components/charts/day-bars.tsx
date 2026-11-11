"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/count-up";

/** Cores de série disponíveis (classe literal: o Tailwind não lê nomes montados). */
const seriesBg = {
  tinta: "bg-texto",
  acao: "bg-acao",
  comunidade: "bg-comunidade",
  pratica: "bg-pratica",
} as const;

export type SeriesColor = keyof typeof seriesBg;

export type DayBarSegment = {
  /** Nome da série (ex.: "Claude"). */
  name: string;
  value: number;
  /** Valor já escrito para exibição (ex.: "260 mil"). */
  valueLabel: string;
  color: SeriesColor;
};

export type DayBar = {
  label: string;
  /** Uma parte por série; uma série só = barra simples. */
  segments: DayBarSegment[];
  /** Total do dia já escrito (ex.: "350 mil tokens"). */
  totalLabel: string;
  isFuture: boolean;
  isToday?: boolean;
};

type DayBarsProps = {
  days: DayBar[];
  /** Topo do eixo, já arredondado para um número limpo. */
  axisMax: number;
  /** Rótulos do eixo: topo e meio (o zero é a linha de base). */
  axisLabels: { top: string; middle: string };
  /** Nome do gráfico para leitores de tela. */
  label: string;
};

/**
 * Colunas finas por dia da semana: eixo discreto com duas linhas de grade,
 * barras de até 12px que crescem ao entrar na tela e um rótulo flutuante no
 * hover/foco. Com mais de uma série, as partes empilham com 2px de respiro.
 */
export function DayBars({ days, axisMax, axisLabels, label }: DayBarsProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasSeries = days.some((day) => day.segments.length > 1);

  return (
    <div className="flex gap-3">
      <div aria-hidden className="flex h-36 flex-col justify-between pb-0 font-mono text-[10px] leading-none text-texto-secundario tabular-nums">
        <span className="-translate-y-1/2">{axisLabels.top}</span>
        <span>{axisLabels.middle}</span>
        <span className="translate-y-1/2">0</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative h-36">
          <span aria-hidden className="absolute inset-x-0 top-0 border-t border-linha/60" />
          <span aria-hidden className="absolute inset-x-0 top-1/2 border-t border-linha/60" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 border-t border-linha" />

          <ul aria-label={label} className="group/chart relative grid h-full grid-cols-7">
            {days.map((day, index) => {
              const total = day.segments.reduce((sum, segment) => sum + segment.value, 0);
              const isEmpty = total === 0;

              return (
                <li key={day.label} className="relative flex justify-center">
                  <button
                    type="button"
                    aria-label={`${day.label}: ${day.isFuture ? "ainda não chegou" : day.totalLabel}`}
                    className="group/bar flex h-full w-full cursor-default items-end justify-center outline-none transition-opacity duration-200 group-hover/chart:opacity-45 hover:opacity-100 focus-visible:opacity-100"
                  >
                    <motion.span
                      className="relative flex w-2.5 flex-col-reverse gap-0.5 lg:w-3"
                      initial={shouldReduceMotion ? false : { height: "0%" }}
                      whileInView={{ height: `${isEmpty ? 0 : Math.max(3, (total / axisMax) * 100)}%` }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.7, delay: index * 0.05, ease: EASE_OUT }}
                    >
                      {day.segments.map((segment, segmentIndex) =>
                        segment.value > 0 ? (
                          <motion.span
                            key={segment.name}
                            className={cn(
                              "block min-h-0 w-full basis-0 ring-texto transition-shadow group-focus-visible/bar:ring-1",
                              seriesBg[segment.color],
                              segmentIndex === day.segments.findLastIndex((item) => item.value > 0) && "rounded-t-[3px]",
                            )}
                            initial={false}
                            animate={{ flexGrow: segment.value }}
                          />
                        ) : null,
                      )}

                      {/* Rótulo flutuante: o valor manda, o dia acompanha. */}
                      <span
                        role="presentation"
                        className={cn(
                          "pointer-events-none absolute bottom-full z-10 mb-2 flex translate-y-1 flex-col gap-0.5 rounded-lg border border-linha bg-fundo px-2.5 py-1.5 text-left whitespace-nowrap opacity-0 transition-[opacity,transform] duration-150 group-hover/bar:translate-y-0 group-hover/bar:opacity-100 group-focus-visible/bar:translate-y-0 group-focus-visible/bar:opacity-100",
                          index === 0 && "left-0",
                          index === days.length - 1 && "right-0",
                          index > 0 && index < days.length - 1 && "left-1/2 -translate-x-1/2",
                        )}
                      >
                        <span className="font-mono text-xs font-medium text-texto tabular-nums">
                          {day.isFuture ? "—" : day.totalLabel}
                        </span>
                        {hasSeries && !day.isFuture
                          ? day.segments.map((segment) => (
                              <span key={segment.name} className="flex items-center gap-1.5 text-[11px] text-texto-secundario">
                                <span aria-hidden className={cn("h-0.5 w-2.5 rounded-full", seriesBg[segment.color])} />
                                <span className="font-mono text-texto tabular-nums">{segment.valueLabel}</span>
                                {segment.name}
                              </span>
                            ))
                          : null}
                        <span className="text-[11px] text-texto-secundario">{day.isToday ? `${day.label} · hoje` : day.label}</span>
                      </span>
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <ul aria-hidden className="mt-2 grid grid-cols-7 text-center font-mono text-[10px] tracking-[0.06em] uppercase">
          {days.map((day) => (
            <li
              key={day.label}
              className={cn(
                day.isFuture ? "text-desativado" : "text-texto-secundario",
                day.isToday && "font-semibold text-texto",
              )}
            >
              {day.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
