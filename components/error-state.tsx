"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { ActionLink } from "@/components/action-link";
import { ColorBurstButton } from "@/components/color-burst-button";

type ErrorStateProps = {
  error: Error & { digest?: string };
  /** Tenta renderizar o trecho de novo (vem do `error.tsx`). */
  retry: () => void;
  /** Link de saída quando tentar de novo não resolve. */
  homeHref?: string;
};

/**
 * Tela de erro editorial, usada pelos `error.tsx`. Diz o que houve sem
 * jargão, oferece tentar de novo e uma saída; o código do erro fica em mono,
 * para quem for reportar.
 */
export function ErrorState({ error, retry, homeHref = "/inicio" }: ErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      role="alert"
      className="flex flex-1 flex-col justify-center gap-6 px-4 py-16 animate-fade-up motion-reduce:animate-none lg:px-0"
    >
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
        <span aria-hidden className="size-2 rounded-[2px] bg-pratica" />
        Algo deu errado
      </p>
      <h1 className="max-w-[18ch] font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] text-balance lg:text-[52px]">
        Esta tela não carregou como deveria.
      </h1>
      <p className="max-w-[48ch] text-[15px] leading-relaxed text-texto-secundario">
        Pode ter sido uma falha passageira. Tente de novo; se continuar, volte para a Home e siga por outro caminho.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <ColorBurstButton type="button" onClick={retry}>
          <RotateCcw aria-hidden strokeWidth={2} />
          Tentar de novo
        </ColorBurstButton>
        <ActionLink href={homeHref} variant="secondary">
          Voltar para a Home
        </ActionLink>
      </div>
      {error.digest ? (
        <p className="border-t border-linha pt-3 font-mono text-[11px] text-texto-secundario">
          código · {error.digest}
        </p>
      ) : null}
    </main>
  );
}
