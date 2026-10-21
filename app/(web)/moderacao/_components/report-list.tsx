import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import type { Report } from "@/lib/data/moderacao";
import { cn } from "@/lib/utils";
import type { StatusFilter } from "../_data-access/get-moderation-data";
import { formatShortDate } from "./format-date";
import { StatusBadge } from "./status-badge";

/** Mesmas colunas no cabeçalho e nas linhas (a partir de md). */
const columnsClass =
  "md:grid md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_56px_96px] md:items-center md:gap-4";

type ReportListProps = {
  items: Report[];
  filter: StatusFilter;
  selectedId: string | null;
};

function kindLabel(report: Report) {
  return report.category ? `${report.kind} · ${report.category}` : report.kind;
}

/**
 * Fila de denúncias. Cada linha é um link que abre o item no painel de
 * detalhe (`?item=`), mantendo o filtro atual. No celular vira lista empilhada.
 */
export function ReportList({ items, filter, selectedId }: ReportListProps) {
  if (items.length === 0) {
    return (
      <SurfaceCard className="mx-0 p-6 text-center text-sm text-texto-secundario">
        Nenhuma denúncia neste filtro.
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="mx-0">
      <div
        aria-hidden
        className={cn(
          "hidden border-b border-linha px-4 py-3 text-xs font-semibold text-texto-secundario",
          columnsClass,
        )}
      >
        <span>Conteúdo</span>
        <span>Motivo</span>
        <span>Denunciado por</span>
        <span>Data</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-linha">
        {items.map((report) => {
          const isSelected = report.id === selectedId;

          return (
            <li key={report.id}>
              <Link
                href={`/moderacao?status=${filter}&item=${report.id}`}
                scroll={false}
                aria-current={isSelected ? "true" : undefined}
                className={cn(
                  "flex flex-col gap-1.5 px-4 py-3 text-sm transition-colors hover:bg-superficie",
                  columnsClass,
                  isSelected && "bg-comunidade/15 shadow-[inset_3px_0_0_var(--color-texto)]",
                )}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-xs text-texto-secundario">{kindLabel(report)}</span>
                  <span className={cn("truncate", isSelected && "font-semibold")}>{report.excerpt}</span>
                </span>
                <span className="text-xs text-texto-secundario md:hidden">
                  {report.reason} · {report.reportedBy} · {formatShortDate(report.reportedAt)}
                </span>
                <span className="hidden truncate md:block">{report.reason}</span>
                <span className="hidden truncate md:block">{report.reportedBy}</span>
                <span className="hidden md:block">{formatShortDate(report.reportedAt)}</span>
                <span>
                  <StatusBadge status={report.status} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}
