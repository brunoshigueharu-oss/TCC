"use client";

import { ErrorState } from "@/components/error-state";

/** Erro inesperado neste grupo de telas: a casca continua e a tela mostra o aviso. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col bg-fundo px-4 font-texto text-texto lg:px-10">
      <ErrorState error={error} retry={retry} homeHref="/inicio" />
    </div>
  );
}
