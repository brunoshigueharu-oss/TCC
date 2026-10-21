import "server-only";

import { reports, type Report, type ReportStatus } from "@/lib/data/moderacao";

/** Filtros da fila, na ordem das abas. O valor vai para `?status=`. */
export const statusFilters = [
  { value: "todas", label: "Todas" },
  { value: "pendentes", label: "Pendentes" },
  { value: "em-analise", label: "Em análise" },
  { value: "resolvidas", label: "Resolvidas" },
] as const;

export type StatusFilter = (typeof statusFilters)[number]["value"];

/** Filtro aberto quando a URL não traz `?status=` (ou traz um inválido). */
const DEFAULT_FILTER: StatusFilter = "pendentes";

const filterToStatus: Record<Exclude<StatusFilter, "todas">, ReportStatus> = {
  pendentes: "pendente",
  "em-analise": "em-analise",
  resolvidas: "resolvida",
};

function isStatusFilter(value: unknown): value is StatusFilter {
  return statusFilters.some((filter) => filter.value === value);
}

function matchesFilter(report: Report, filter: StatusFilter) {
  return filter === "todas" || report.status === filterToStatus[filter];
}

export type ModerationData = {
  filter: StatusFilter;
  counts: Record<StatusFilter, number>;
  items: Report[];
  /** Item aberto no painel de detalhe — o de `?item=` ou o primeiro da lista. */
  selected: Report | null;
};

/**
 * Busca a fila de denúncias. No protótipo filtra dados fictícios; na versão
 * real chama a API com o papel de moderador da sessão.
 */
export async function getModerationData(
  rawFilter: unknown,
  rawItem: unknown,
): Promise<ModerationData> {
  const filter = isStatusFilter(rawFilter) ? rawFilter : DEFAULT_FILTER;
  const items = reports.filter((report) => matchesFilter(report, filter));
  const counts = Object.fromEntries(
    statusFilters.map(({ value }) => [
      value,
      reports.filter((report) => matchesFilter(report, value)).length,
    ]),
  ) as Record<StatusFilter, number>;
  const selected = items.find((report) => report.id === rawItem) ?? items[0] ?? null;

  return { filter, counts, items, selected };
}
