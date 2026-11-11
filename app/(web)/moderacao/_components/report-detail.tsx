import type { Report } from "@/lib/data/moderacao";
import { formatFullDate } from "./format-date";
import { ReportDecision } from "./report-decision";
import { StatusBadge } from "./status-badge";

function formatReporters(report: Report) {
  if (report.otherReporters === 0) return report.reportedBy;
  const people = report.otherReporters === 1 ? "pessoa" : "pessoas";
  return `${report.reportedBy} e mais ${report.otherReporters} ${people}`;
}

function formatWarnings(count: number) {
  if (count === 0) return "sem advertências";
  return count === 1 ? "1 advertência anterior" : `${count} advertências anteriores`;
}

/**
 * Painel lateral com o item denunciado em destaque (citação grande), os
 * fatos em linhas e as decisões. Fica preso ao rolar no computador.
 */
export function ReportDetail({ report }: { report: Report }) {
  const facts = [
    { label: "Onde", value: report.location },
    { label: "Autor", value: `${report.author} · ${formatWarnings(report.previousWarnings)}` },
    { label: "Motivo", value: report.reason },
    { label: "Denunciado por", value: formatReporters(report) },
    { label: "Data", value: formatFullDate(report.reportedAt) },
  ];

  return (
    <aside aria-labelledby="detalhe-titulo" className="flex flex-col gap-6 xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-3 border-b border-linha pb-3">
        <h2 id="detalhe-titulo" className="text-xs font-semibold tracking-[0.08em] uppercase">
          Detalhe
        </h2>
        <StatusBadge status={report.status} />
      </div>

      <figure className="flex flex-col gap-2">
        <figcaption className="font-mono text-[11px] text-texto-secundario uppercase">{report.kind}</figcaption>
        <blockquote className="border-l-2 border-texto pl-4 font-display text-[22px] leading-snug font-medium tracking-[-0.02em]">
          “{report.excerpt}”
        </blockquote>
      </figure>

      <dl className="flex flex-col border-t border-linha text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 border-b border-linha py-2.5">
            <dt className="text-texto-secundario">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {report.status === "resolvida" ? (
        <p className="flex items-center gap-2 text-sm text-texto-secundario">
          <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
          Esta denúncia já foi resolvida.
        </p>
      ) : (
        <ReportDecision key={report.id} reportId={report.id} />
      )}
    </aside>
  );
}
