import Link from "next/link";

/** Rotas do protótipo que ainda não têm tela. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center gap-3 px-6">
      <p className="text-xs font-semibold tracking-wide text-texto-secundario">PROTÓTIPO</p>
      <h1 className="text-3xl font-bold text-texto">Esta tela ainda não foi construída.</h1>
      <Link href="/inicio" className="text-sm font-semibold text-texto underline">
        Voltar para a Home
      </Link>
    </main>
  );
}
