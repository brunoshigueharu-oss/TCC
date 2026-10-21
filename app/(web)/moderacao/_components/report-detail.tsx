import { SurfaceCard } from "@/components/surface-card";
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

/** Painel lateral com o item denunciado, o contexto e as ações. */
export function ReportDetail({ report }: { report: Report }) {
  const facts = [
    { label: "Onde", value: report.location },
    { label: "Autor", value: `${report.author} · ${formatWarnings(report.previousWarnings)}` },
    { label: "Motivo", value: report.reason },
    { label: "Denunciado por", value: formatReporters(report) },
    { label: "Data", value: formatFullDate(report.reportedAt) },
  ];

  return (
    <SurfaceCard as="aside" aria-labelledby="detalhe-titulo" className="mx-0 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="detalhe-titulo" className="font-display text-lg font-bold">
          Detalhe da denúncia
        </h2>
        <StatusBadge status={report.status} />
      </div>

      <blockquote className="rounded-xl bg-superficie p-3">
        <p className="text-xs font-semibold text-texto-secundario">{report.kind}</p>
        <p className="mt-1 text-[15px] leading-snug">“{report.excerpt}”</p>
      </blockquote>

      <dl className="flex flex-col gap-3 text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-0.5">
            <dt className="text-xs text-texto-secundario">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {report.status === "resolvida" ? (
        <p className="rounded-xl bg-acao/15 p-3 text-sm">Esta denúncia já foi resolvida.</p>
      ) : (
        <ReportDecision key={report.id} reportId={report.id} />
      )}
    </SurfaceCard>
  );
}
