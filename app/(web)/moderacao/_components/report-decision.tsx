"use client";

import { useActionState, useEffect } from "react";

import { ColorBurstButton } from "@/components/color-burst-button";
import { toast } from "@/components/ui/toast";
import { decideReport, type DecisionResult } from "../_actions/decide-report";

type ReportDecisionProps = {
  reportId: string;
};

/**
 * Decisões (Manter / Advertir / Remover). O botão clicado vai no FormData
 * (`decision`) para a Server Action. Remover é o primário; o resultado vira
 * aviso (toast) e uma linha de status no lugar dos botões.
 */
export function ReportDecision({ reportId }: ReportDecisionProps) {
  const [result, formAction, isPending] = useActionState<DecisionResult | null, FormData>(decideReport, null);

  useEffect(() => {
    if (!result) return;
    toast({
      title: result.success ? "Decisão registrada" : "Não foi possível registrar",
      description: result.message,
      tone: result.success ? "sucesso" : "erro",
    });
  }, [result]);

  if (result?.success) {
    return (
      <p role="status" className="flex items-start gap-2 border-t border-linha pt-4 text-sm leading-relaxed">
        <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-[2px] bg-acao" />
        {result.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Decisão</p>
      <input type="hidden" name="reportId" value={reportId} />
      <div className="grid grid-cols-2 gap-2">
        <ColorBurstButton type="submit" name="decision" value="manter" disabled={isPending} variant="secondary" size="sm">
          Manter
        </ColorBurstButton>
        <ColorBurstButton type="submit" name="decision" value="advertir" disabled={isPending} variant="secondary" size="sm">
          Advertir
        </ColorBurstButton>
      </div>
      <ColorBurstButton type="submit" name="decision" value="remover" disabled={isPending} className="w-full">
        {isPending ? "Registrando…" : "Remover conteúdo"}
      </ColorBurstButton>
      {result && !result.success ? (
        <p role="alert" className="text-sm text-texto-secundario">
          {result.message}
        </p>
      ) : null}
    </form>
  );
}
