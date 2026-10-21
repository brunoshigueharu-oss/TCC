"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { decideReport, type DecisionResult } from "../_actions/decide-report";

const outlineClass = "h-11 w-full rounded-xl bg-fundo text-sm font-semibold text-texto ring-1 ring-linha hover:bg-superficie";

type ReportDecisionProps = {
  reportId: string;
};

/**
 * Botões de decisão (Manter / Remover / Advertir). O botão clicado vai no
 * FormData (`decision`) para a Server Action. Remover = azul-noite.
 */
export function ReportDecision({ reportId }: ReportDecisionProps) {
  const [result, formAction, isPending] = useActionState<DecisionResult | null, FormData>(
    decideReport,
    null,
  );

  if (result?.success) {
    return (
      <p role="status" className="rounded-xl bg-acao/15 p-3 text-sm">
        {result.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="reportId" value={reportId} />
      <Button type="submit" name="decision" value="manter" disabled={isPending} className={outlineClass}>
        Manter
      </Button>
      <Button
        type="submit"
        name="decision"
        value="remover"
        disabled={isPending}
        className="h-11 w-full rounded-xl bg-texto text-sm font-semibold text-fundo hover:bg-texto/90"
      >
        Remover
      </Button>
      <Button type="submit" name="decision" value="advertir" disabled={isPending} className={outlineClass}>
        Advertir usuário
      </Button>
      {result && !result.success ? (
        <p role="alert" className={cn("text-sm text-texto-secundario")}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
