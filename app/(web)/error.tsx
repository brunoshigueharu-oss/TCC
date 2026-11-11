"use client";

import { ErrorState } from "@/components/error-state";

/** Erro inesperado neste grupo de telas: a casca continua e a tela mostra o aviso. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:px-10">
      <ErrorState error={error} retry={retry} homeHref="/inicio" />
    </div>
  );
}
