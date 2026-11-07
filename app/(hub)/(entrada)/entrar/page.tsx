import type { Metadata } from "next";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { BrandHeader } from "../_components/brand-header";
import { SocialSignIn } from "../_components/social-sign-in";
import { WelcomeCard } from "../_components/welcome-card";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = { title: "Entrar" };

/**
 * Login (Figma: "Login"). Protótipo sem autenticação: o formulário só valida e
 * leva para a Home. `?recuperar=1` mostra o aviso de recuperação de senha.
 */
export default async function LoginPage({ searchParams }: PageProps<"/entrar">) {
  const isRecovering = (await searchParams).recuperar === "1";

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-5 pt-2 pb-6 lg:flex-none lg:gap-6 lg:px-6 lg:pt-0 lg:pb-0">
        <WelcomeCard
          title="Entrar"
          subtitle="Continue sua trilha de onde parou."
          composition="entrar"
        />

        {isRecovering ? (
          <SurfaceCard role="status" className="p-4 text-sm leading-relaxed lg:px-6">
            <p className="font-semibold">Recuperação de senha</p>
            <p className="text-texto-secundario">
              Se o e-mail estiver cadastrado, você recebe um link para criar uma nova senha.
            </p>
          </SurfaceCard>
        ) : null}

        <SurfaceCard>
          <SocialSignIn destination="/inicio" />
          <LoginForm />
        </SurfaceCard>

        <p className="mt-auto flex items-center justify-center gap-1 px-4 text-sm lg:px-0">
          Ainda não tem conta?
          <Link
            href="/cadastro"
            className="flex min-h-11 items-center font-semibold underline underline-offset-4"
          >
            Criar conta
          </Link>
        </p>
      </main>
    </>
  );
}
