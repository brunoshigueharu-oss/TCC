import Image from "next/image";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { Shortcuts } from "./shortcuts";

type HomeHeroProps = {
  firstName: string;
  level: number;
  xp: number;
  unreadNotifications: number;
};

/**
 * Faixa do topo: ilustração ocupando o banner, com a saudação por cima. Os
 * atalhos ficam metade dentro, metade fora da faixa.
 */
export function HomeHero({ firstName, level, xp, unreadNotifications }: HomeHeroProps) {
  return (
    <header className="relative">
      <div className="relative h-[176px] overflow-hidden bg-fundo">
        <Image
          src="/inicio/banner-ilustracao.png"
          alt=""
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="pointer-events-none object-cover"
        />

        {/* Gradiente em multiply: escurece a base da ilustração para o texto branco ler bem. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-500/70 to-transparent mix-blend-multiply"
        />

        <div className="absolute bottom-[50px] left-6 flex items-center gap-3 text-white">
          <span
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full border-[3px] border-fundo bg-texto font-display text-2xl font-bold text-trilha"
          >
            {firstName.charAt(0)}
          </span>
          <div className="flex flex-col">
            <h1 className="font-display text-[22px] leading-tight font-bold">Olá, {firstName}!</h1>
            <p className="text-sm font-medium">
              Nível {formatTwoDigits(level)} · {formatNumber(xp)} XP
            </p>
          </div>
        </div>
      </div>

      <Shortcuts unreadNotifications={unreadNotifications} className="-mt-[38px] px-4" />
    </header>
  );
}
