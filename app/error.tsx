"use client";

import { ErrorState } from "@/components/error-state";

/** Erro inesperado neste grupo de telas: a casca continua e a tela mostra o aviso. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState error={error} retry={retry} homeHref="/inicio" />;
}
