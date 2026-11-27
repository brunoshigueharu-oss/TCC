import Image from "next/image";

import { formatNumber, formatTwoDigits } from "@/lib/format";

type HomeGreetingProps = {
  firstName: string;
  level: number;
  xp: number;
  /** Foto de perfil. Sem foto, o círculo mostra a inicial. */
  photoUrl?: string;
  /** Imagem de fundo escolhida pela pessoa. Sem imagem, o topo fica liso. */
  coverUrl?: string;
  weekday: string;
  dateLabel: string;
};

/**
 * Abertura da Home: a imagem de fundo e a foto que a pessoa escolheu (um
 * espaço de expressão para um público criativo), com a saudação, o nível e o
 * XP por cima, para ler tudo de relance.
 */
export function HomeGreeting({ firstName, level, xp, photoUrl, coverUrl, weekday, dateLabel }: HomeGreetingProps) {
  return (
    <header className="relative px-4 pt-6 pb-7 lg:px-0 lg:pt-4 lg:pb-10">
      <p className="mb-4 flex animate-fade-up items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase motion-reduce:animate-none">
        <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
        {weekday}
        <span className="font-mono font-normal tracking-normal tabular-nums">{dateLabel}</span>
      </p>

      <div className="relative h-[180px] animate-blur-in overflow-hidden rounded-[20px] bg-superficie motion-reduce:animate-none lg:h-[240px] lg:rounded-[28px]">
        {coverUrl ? (
          <>
            <Image
              src={coverUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) min(1120px, calc(100vw - 336px)), 100vw"
              className="pointer-events-none object-cover"
            />
            {/* Escurece a base da imagem para o texto branco ler bem. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-500/70 to-transparent mix-blend-multiply"
            />
          </>
        ) : null}

        <div
          className={`absolute bottom-5 left-5 flex items-center gap-4 lg:bottom-8 lg:left-8 lg:gap-5 ${coverUrl ? "text-white" : "text-texto"}`}
        >
          <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-fundo bg-texto font-display text-2xl font-semibold text-fundo lg:size-24 lg:text-4xl">
            {photoUrl ? (
              <Image src={photoUrl} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <span aria-hidden>{firstName.charAt(0)}</span>
            )}
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[32px] leading-none font-medium tracking-[-0.04em] lg:text-[56px]">
              Olá, {firstName}.
            </h1>
            <p className="font-mono text-sm tabular-nums lg:text-base">
              Nível {formatTwoDigits(level)} · {formatNumber(xp)} XP
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
