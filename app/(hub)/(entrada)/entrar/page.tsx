import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BrandHeader } from "../_components/brand-header";
import { EntryHeading } from "../_components/entry-heading";
import { SocialSignIn } from "../_components/social-sign-in";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = { title: "Entrar" };

/**
 * Login. Protótipo sem autenticação: o formulário leva para a Home.
 * `?recuperar=1` mostra o aviso de recuperação de senha.
 */
export default async function LoginPage({ searchParams }: PageProps<"/entrar">) {
  const isRecovering = (await searchParams).recuperar === "1";

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-8 px-4 pt-6 pb-8 lg:flex-none lg:gap-10 lg:px-0 lg:pt-0 lg:pb-0">
        <EntryHeading id="titulo-entrar" eyebrow="Entrar" title="Bom ter você de volta." description="Continue a trilha de onde parou." />

        {isRecovering ? (
          <p role="status" className="flex items-start gap-3 border-y border-linha py-4 text-sm leading-relaxed">
            <MailCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-acao" strokeWidth={2} />
            <span>
              <span className="font-semibold">Link de recuperação a caminho.</span>{" "}
              <span className="text-texto-secundario">
                Se o e-mail estiver cadastrado, você recebe um link para criar uma nova senha.
              </span>
            </span>
          </p>
        ) : null}

        <div className="flex flex-col gap-6">
          <SocialSignIn destination="/inicio" />
          <LoginForm />
        </div>

        <p className="mt-auto flex flex-wrap items-center gap-x-1.5 border-t border-linha pt-5 text-sm text-texto-secundario lg:mt-0">
          Ainda não tem conta?
          <Link
            href="/cadastro"
            className="flex min-h-11 items-center font-semibold text-texto underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-texto"
          >
            Criar conta grátis
          </Link>
        </p>
      </main>
    </>
  );
}
