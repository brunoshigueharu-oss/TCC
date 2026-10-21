import Link from "next/link";

/**
 * Confirmação de exclusão (aberta por `?excluir=1`). Ação destrutiva em
 * azul-noite, como no resto do hub. No protótipo, confirmar leva ao login.
 */
export function DeleteAccountConfirm() {
  return (
    <div role="alertdialog" aria-labelledby="excluir-titulo" className="flex flex-col gap-3 rounded-2xl bg-fundo p-4 ring-1 ring-texto">
      <p id="excluir-titulo" className="font-display text-lg leading-snug font-bold">
        Excluir a conta de vez?
      </p>
      <p className="text-sm text-texto-secundario">Esta ação não pode ser desfeita.</p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/perfil/configuracoes"
          scroll={false}
          className="flex h-11 items-center justify-center rounded-xl text-sm font-semibold ring-1 ring-linha"
        >
          Cancelar
        </Link>
        <Link
          href="/entrar"
          className="flex h-11 items-center justify-center rounded-xl bg-texto text-sm font-semibold text-fundo"
        >
          Excluir conta
        </Link>
      </div>
    </div>
  );
}
