import Image from "next/image";
import { formatNumber, formatTwoDigits } from "@/lib/format";

type HomeHeroProps = {
  firstName: string;
  level: number;
  xp: number;
};

/**
 * Faixa do topo: ilustração ocupando o banner, com a saudação por cima. Logo
 * abaixo já vem o conteúdo (de onde parou, semana, comunidade) — a navegação
 * entre as áreas fica só na barra inferior.
 */
export function HomeHero({ firstName, level, xp }: HomeHeroProps) {
  return (
    <header className="relative">
      <div className="relative h-[140px] overflow-hidden bg-fundo lg:h-[196px] lg:rounded-[28px]">
        <Image
          src="/inicio/banner-ilustracao.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) min(1120px, calc(100vw - 336px)), (max-width: 480px) 100vw, 480px"
          className="pointer-events-none object-cover"
        />

        {/* Gradiente em multiply: escurece a base da ilustração para o texto branco ler bem. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-500/70 to-transparent mix-blend-multiply"
        />

        <div className="absolute bottom-5 left-6 flex items-center gap-3 text-white lg:bottom-8 lg:left-8 lg:gap-4">
          <span
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full border-[3px] border-fundo bg-texto font-display text-2xl font-bold text-trilha lg:size-20 lg:text-3xl"
          >
            {firstName.charAt(0)}
          </span>
          <div className="flex flex-col">
            <h1 className="font-display text-[22px] leading-tight font-bold lg:text-[32px]">Olá, {firstName}!</h1>
            <p className="text-sm font-medium lg:text-base">
              Nível {formatTwoDigits(level)} · {formatNumber(xp)} XP
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
