import type { ReportStatus } from "@/lib/data/moderacao";
import { cn } from "@/lib/utils";

const statusLabel: Record<ReportStatus, string> = {
  pendente: "Pendente",
  "em-analise": "Em análise",
  resolvida: "Resolvida",
};

/** Classes literais por status (o Tailwind não lê nomes montados). */
const statusClass: Record<ReportStatus, string> = {
  pendente: "bg-fundo ring-1 ring-texto",
  "em-analise": "bg-trilha/30 ring-1 ring-trilha",
  resolvida: "bg-acao/15 ring-1 ring-acao",
};

/** Etiqueta do status da denúncia. */
export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-semibold whitespace-nowrap",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
