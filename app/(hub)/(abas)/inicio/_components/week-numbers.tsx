import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { CountUp } from "../../perfil/_components/motion/count-up";
import type { WeekOverview } from "../_data-access/get-home-data";

type WeekNumbersProps = {
  week: WeekOverview;
  friendsRank: number;
};

const valueClass = "font-mono text-[40px] leading-none font-extralight tracking-[-0.05em] tabular-nums lg:text-[56px]";
const unitClass = "ml-1.5 font-sans text-sm font-medium tracking-normal text-texto-secundario";

const stickerClass = "pointer-events-none absolute top-4 right-4 h-11 w-auto select-none lg:top-6 lg:right-6 lg:h-14";
const tiltedStickerClass = `${stickerClass} rotate-6`;
/** A medalha é mais alta que larga (a fita ocupa o topo): ganha altura extra para o disco ficar do tamanho dos outros. */
const medalStickerClass = "pointer-events-none absolute top-3 right-4 h-14 w-auto rotate-6 select-none lg:top-5 lg:right-6 lg:h-18";

/** A semana em quatro números grandes e finos, separados por linhas. */
export function WeekNumbers({ week, friendsRank }: WeekNumbersProps) {
  return (
    <section aria-labelledby="semana" className="flex flex-col lg:col-span-12">
      <SectionHeading id="semana" title="Sua semana" href="/perfil" tone="acao" meta="seg — dom" />

      <dl className="mx-4 grid grid-cols-2 lg:mx-0 lg:grid-cols-4 lg:divide-x lg:divide-linha">
        <div className="relative flex flex-col-reverse gap-3 border-b border-linha py-5 pr-4 lg:border-b-0 lg:py-7 lg:pr-6">
          <Image src="/inicio/semana/estrela.webp" alt="" width={320} height={308} className={tiltedStickerClass} />
          <dt className="text-xs text-texto-secundario">XP ganhos na semana</dt>
          <dd className={valueClass}>
            <CountUp value={week.xp} />
            <span className={unitClass}>XP</span>
          </dd>
        </div>
        <div className="relative flex flex-col-reverse gap-3 border-b border-l border-linha py-5 pl-4 lg:border-b-0 lg:border-l-0 lg:px-6 lg:py-7">
          <Image src="/inicio/semana/fogo.webp" alt="" width={241} height={320} className={stickerClass} />
          <dt className="text-xs text-texto-secundario">Sequência de dias seguidos</dt>
          <dd className={valueClass}>
            <CountUp value={week.streakDays} format="twoDigits" duration={0.6} />
            <span className={unitClass}>{week.streakDays === 1 ? "dia" : "dias"}</span>
          </dd>
        </div>
        <div className="relative flex flex-col-reverse gap-3 py-5 pr-4 lg:px-6 lg:py-7">
          <Image src="/inicio/semana/relogio.webp" alt="" width={319} height={320} className={tiltedStickerClass} />
          <dt className="text-xs text-texto-secundario">Tempo de estudo</dt>
          <dd className={valueClass}>
            <CountUp value={week.studyMinutes} />
            <span className={unitClass}>min</span>
          </dd>
        </div>
        <div className="relative flex flex-col-reverse gap-3 border-l border-linha py-5 pl-4 lg:border-l-0 lg:py-7 lg:pl-6">
          <Image src="/inicio/semana/medalha-disco.webp" alt="" width={238} height={320} className={medalStickerClass} />
          <dt className="text-xs text-texto-secundario">
            <Link
              href="/perfil/ranking"
              className="underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:decoration-texto"
            >
              Posição entre amigos
            </Link>
          </dt>
          <dd className={valueClass}>
            {friendsRank}
            <span className={unitClass}>º lugar</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
