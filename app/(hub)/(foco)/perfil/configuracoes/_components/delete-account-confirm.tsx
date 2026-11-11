import Link from "next/link";

/**
 * Confirmação de exclusão (aberta por `?excluir=1`). Ação destrutiva em
 * azul-noite, como no resto do hub. No protótipo, confirmar leva ao login.
 */
export function DeleteAccountConfirm() {
  return (
    <div role="alertdialog" aria-labelledby="excluir-titulo" className="flex flex-col gap-3 rounded-xl border border-texto p-4">
      <p id="excluir-titulo" className="font-display text-xl leading-snug font-medium tracking-[-0.02em]">
        Excluir a conta de vez?
      </p>
      <p className="text-sm text-texto-secundario">Esta ação não pode ser desfeita.</p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/perfil/configuracoes"
          scroll={false}
          className="flex h-11 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-linha transition-colors hover:bg-superficie hover:ring-texto"
        >
          Cancelar
        </Link>
        <Link
          href="/entrar"
          className="flex h-11 items-center justify-center rounded-full bg-texto text-sm font-semibold text-fundo transition-transform active:scale-[0.98]"
        >
          Excluir conta
        </Link>
      </div>
    </div>
  );
}
