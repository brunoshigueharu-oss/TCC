import Link from "next/link";

import type { Report } from "@/lib/data/moderacao";
import { cn } from "@/lib/utils";
import type { StatusFilter } from "../_data-access/get-moderation-data";
import { formatShortDate } from "./format-date";
import { StatusBadge } from "./status-badge";

/** Mesmas colunas no cabeçalho e nas linhas (a partir de md). */
const columnsClass =
  "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)_minmax(0,1fr)_52px_104px] md:items-center md:gap-4";

type ReportListProps = {
  items: Report[];
  filter: StatusFilter;
  selectedId: string | null;
};

function kindLabel(report: Report) {
  return report.category ? `${report.kind} · ${report.category}` : report.kind;
}

/**
 * Fila de denúncias em linhas (tabela no computador, lista empilhada no
 * celular). Cada linha abre o item no painel de detalhe (`?item=`), mantendo
 * o filtro. A selecionada ganha régua à esquerda e fundo suave.
 */
export function ReportList({ items, filter, selectedId }: ReportListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-2 border-y border-linha py-10">
        <p className="font-mono text-[11px] text-texto-secundario">00 itens</p>
        <p className="font-display text-2xl font-medium tracking-[-0.03em]">Fila limpa neste filtro.</p>
        <p className="text-sm text-texto-secundario">Nenhuma denúncia com este status no momento.</p>
      </div>
    );
  }

  return (
    <div>
      <div
        aria-hidden
        className={cn(
          "hidden border-b border-linha pb-2 font-mono text-[11px] text-texto-secundario uppercase",
          columnsClass,
        )}
      >
        <span className="pl-4">Conteúdo</span>
        <span>Motivo</span>
        <span>Denunciado por</span>
        <span>Data</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-linha border-b border-linha">
        {items.map((report) => {
          const isSelected = report.id === selectedId;

          return (
            <li key={report.id}>
              <Link
                href={`/moderacao?status=${filter}&item=${report.id}`}
                scroll={false}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "relative flex min-h-16 flex-col gap-1.5 py-3 pr-2 pl-4 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-inset",
                  columnsClass,
                  isSelected ? "bg-superficie" : "hover:bg-superficie/60",
                )}
              >
                {isSelected ? (
                  <span aria-hidden className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-texto" />
                ) : null}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-[11px] text-texto-secundario">{kindLabel(report)}</span>
                  <span className={cn("truncate", isSelected ? "font-semibold" : "font-medium")}>{report.excerpt}</span>
                </span>
                <span className="text-xs text-texto-secundario md:hidden">
                  {report.reason} · {report.reportedBy} · {formatShortDate(report.reportedAt)}
                </span>
                <span className="hidden truncate text-texto-secundario md:block">{report.reason}</span>
                <span className="hidden truncate text-texto-secundario md:block">{report.reportedBy}</span>
                <span className="hidden font-mono text-xs text-texto-secundario tabular-nums md:block">
                  {formatShortDate(report.reportedAt)}
                </span>
                <span>
                  <StatusBadge status={report.status} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
