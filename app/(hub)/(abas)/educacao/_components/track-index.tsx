import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Track } from "@/lib/data/trilha";
import { formatTwoDigits } from "@/lib/format";

type TrackIndexProps = {
  track: Track;
  currentModuleNumber: number;
};

/**
 * Índice da trilha inteira, como o sumário de um livro: o módulo atual em
 * texto cheio, os próximos apagados. Fecha com o atalho para a prova.
 */
export function TrackIndex({ track, currentModuleNumber }: TrackIndexProps) {
  return (
    <aside aria-labelledby="indice-da-trilha" className="flex flex-col gap-10 px-4 lg:px-0">
      <section className="flex flex-col">
        <h2
          id="indice-da-trilha"
          className="flex min-h-11 items-center gap-2.5 border-b border-linha text-xs font-semibold tracking-[0.08em] uppercase"
        >
          <span aria-hidden className="size-2 rounded-[2px] bg-trilha" />
          Índice da trilha
        </h2>
        <ol>
          {track.modules.map((trackModule) => (
            <li
              key={trackModule.id}
              aria-current={trackModule.number === currentModuleNumber ? "step" : undefined}
              className="flex items-baseline gap-3 border-b border-linha py-3"
            >
              <span className="font-mono text-[11px] tabular-nums">{formatTwoDigits(trackModule.number)}</span>
              <span className="flex-1 text-[15px] font-medium">{trackModule.title}</span>
              <span className="font-mono text-[11px] text-texto-secundario uppercase">Atual</span>
            </li>
          ))}
          {track.upcomingModules.map((upcoming) => (
            <li key={upcoming.number} className="flex items-baseline gap-3 border-b border-linha py-3 text-desativado">
              <span className="font-mono text-[11px] tabular-nums">{formatTwoDigits(upcoming.number)}</span>
              <span className="flex-1 text-[15px]">{upcoming.title}</span>
              <span className="font-mono text-[11px] tabular-nums">{formatTwoDigits(upcoming.lessonsCount)} lições</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pular-modulo" className="flex flex-col gap-3 border-t border-texto pt-4">
        <h2 id="pular-modulo" className="font-display text-xl leading-tight font-medium tracking-[-0.025em]">
          Já domina este módulo?
        </h2>
        <p className="text-sm leading-relaxed text-texto-secundario">
          Faça o teste de proficiência e siga direto para o módulo {formatTwoDigits(currentModuleNumber + 1)}.
        </p>
        <Link
          href="/educacao/proficiencia"
          className="group flex min-h-11 items-center gap-2 self-start text-sm font-semibold underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:ring-2 focus-visible:ring-texto"
        >
          Ver o teste
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </Link>
      </section>
    </aside>
  );
}
