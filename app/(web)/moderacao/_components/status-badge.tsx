import type { ReportStatus } from "@/lib/data/moderacao";
import { cn } from "@/lib/utils";

const statusLabel: Record<ReportStatus, string> = {
  pendente: "Pendente",
  "em-analise": "Em análise",
  resolvida: "Resolvida",
};

/** Marcador por status (classes literais: o Tailwind não lê nomes montados). */
const statusMarker: Record<ReportStatus, string> = {
  pendente: "bg-pratica",
  "em-analise": "bg-trilha",
  resolvida: "bg-acao",
};

/** Status da denúncia: quadradinho na cor + rótulo, sem caixa. */
export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
      <span aria-hidden className={cn("size-2 rounded-[2px]", statusMarker[status])} />
      {statusLabel[status]}
    </span>
  );
}
