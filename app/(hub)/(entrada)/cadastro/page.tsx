import type { Metadata } from "next";
import Link from "next/link";

import { BrandHeader } from "../_components/brand-header";
import { EntryHeading } from "../_components/entry-heading";
import { SocialSignIn } from "../_components/social-sign-in";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = { title: "Criar conta" };

/** Cadastro. Ao criar a conta, segue para o primeiro acesso (onboarding). */
export default function SignUpPage() {
  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-8 px-4 pt-6 pb-8 lg:flex-none lg:gap-10 lg:px-0 lg:pt-0 lg:pb-0">
        <EntryHeading
          id="titulo-cadastro"
          eyebrow="Criar conta"
          title="Design e código, na mesma conversa."
          description="Gratuito. Leva menos de um minuto e você já começa pela trilha certa."
        />

        <div className="flex flex-col gap-6">
          <SocialSignIn destination="/onboarding" />
          <SignUpForm />
        </div>

        <p className="mt-auto flex flex-wrap items-center gap-x-1.5 border-t border-linha pt-5 text-sm text-texto-secundario lg:mt-0">
          Já tem cadastro?
          <Link
            href="/entrar"
            className="flex min-h-11 items-center font-semibold text-texto underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-texto"
          >
            Entrar
          </Link>
        </p>
      </main>
    </>
  );
}
