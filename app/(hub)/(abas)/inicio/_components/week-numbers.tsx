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

/** A semana em quatro números grandes e finos, separados por linhas. */
export function WeekNumbers({ week, friendsRank }: WeekNumbersProps) {
  return (
    <section aria-labelledby="semana" className="flex flex-col lg:col-span-12">
      <SectionHeading id="semana" title="Sua semana" href="/perfil" tone="acao" meta="seg — dom" />

      <dl className="mx-4 grid grid-cols-2 lg:mx-0 lg:grid-cols-4 lg:divide-x lg:divide-linha">
        <div className="flex flex-col-reverse gap-3 border-b border-linha py-5 pr-4 lg:border-b-0 lg:py-7 lg:pr-6">
          <dt className="text-xs text-texto-secundario">XP ganhos na semana</dt>
          <dd className={valueClass}>
            <CountUp value={week.xp} />
            <span className={unitClass}>XP</span>
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-3 border-b border-l border-linha py-5 pl-4 lg:border-b-0 lg:border-l-0 lg:px-6 lg:py-7">
          <dt className="text-xs text-texto-secundario">Sequência de dias seguidos</dt>
          <dd className={valueClass}>
            <CountUp value={week.streakDays} format="twoDigits" duration={0.6} />
            <span className={unitClass}>{week.streakDays === 1 ? "dia" : "dias"}</span>
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-3 py-5 pr-4 lg:px-6 lg:py-7">
          <dt className="text-xs text-texto-secundario">Tempo de estudo</dt>
          <dd className={valueClass}>
            <CountUp value={week.studyMinutes} />
            <span className={unitClass}>min</span>
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-3 border-l border-linha py-5 pl-4 lg:border-l-0 lg:py-7 lg:pl-6">
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
