"use client";

import { useActionState } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { cn } from "@/lib/utils";
import { decideReport, type DecisionResult } from "../_actions/decide-report";


type ReportDecisionProps = {
  reportId: string;
};

/**
 * Botões de decisão (Manter / Remover / Advertir). O botão clicado vai no
 * FormData (`decision`) para a Server Action. Remover = primário (pílula azul-noite).
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
      <ColorBurstButton
        type="submit"
        name="decision"
        value="manter"
        disabled={isPending}
        variant="secondary"
        size="sm"
        className="w-full"
      >
        Manter
      </ColorBurstButton>
      <ColorBurstButton type="submit" name="decision" value="remover" disabled={isPending} size="sm" className="w-full">
        Remover
      </ColorBurstButton>
      <ColorBurstButton
        type="submit"
        name="decision"
        value="advertir"
        disabled={isPending}
        variant="secondary"
        size="sm"
        className="w-full"
      >
        Advertir usuário
      </ColorBurstButton>
      {result && !result.success ? (
        <p role="alert" className={cn("text-sm text-texto-secundario")}>
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
