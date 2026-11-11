import type { ReactNode } from "react";

import { SectionHeading } from "@/components/section-heading";
import { formatNumber } from "@/lib/format";
import type { WeekOverview } from "../_data-access/get-home-data";

type WeekSummaryProps = {
  week: WeekOverview;
};

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-texto">{children}</strong>;
}

function joinDays(days: string[]) {
  if (days.length <= 1) return days[0] ?? "";
  return `${days.slice(0, -1).join(", ")} e ${days[days.length - 1]}`;
}

/**
 * Resumo da semana escrito a partir dos números (dias ativos, XP, melhor dia,
 * dias em branco): um parágrafo para ler, no lugar de mais um painel. No
 * protótipo o texto é montado por regras; na versão real pode vir de um modelo.
 */
export function WeekSummary({ week }: WeekSummaryProps) {
  const { activeDays, elapsedDays, xp, bestDay, missedDays, answersGiven } = week;

  return (
    <section aria-labelledby="resumo-semana" className="flex flex-col lg:col-span-5">
      <SectionHeading id="resumo-semana" title="Resumo da semana" tone="acao" meta="gerado hoje" />

      <div className="flex flex-col gap-4 px-4 pt-5 pb-7 lg:px-0 lg:pt-6">
        <p className="font-display text-[22px] leading-[1.3] font-medium tracking-[-0.02em] text-texto-secundario lg:text-2xl">
          Você estudou em{" "}
          <Strong>
            {activeDays} de {elapsedDays} dias
          </Strong>{" "}
          e somou <Strong>{formatNumber(xp)} XP</Strong>.
          {bestDay ? (
            <>
              {" "}
              O melhor dia foi <Strong>{bestDay.name}</Strong>, com {bestDay.xp} XP.
            </>
          ) : null}
          {answersGiven > 0 ? (
            <>
              {" "}
              Na comunidade, você respondeu{" "}
              <Strong>{answersGiven === 1 ? "uma dúvida" : `${answersGiven} dúvidas`}</Strong> da turma.
            </>
          ) : null}
        </p>
        <p className="max-w-[46ch] text-sm leading-relaxed text-texto-secundario">
          {missedDays.length > 0
            ? `${joinDays(missedDays).replace(/^./, (first) => first.toUpperCase())} ficou em branco. Uma lição curta nesses dias já mantém a sequência.`
            : "Nenhum dia em branco até aqui. Mantenha o ritmo até domingo."}
        </p>
        <p className="font-mono text-[10px] tracking-[0.06em] text-desativado uppercase">
          Texto montado a partir da sua atividade
        </p>
      </div>
    </section>
  );
}
