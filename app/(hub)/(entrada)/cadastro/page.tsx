import type { Metadata } from "next";
import Link from "next/link";

import { SurfaceCard } from "@/components/surface-card";
import { BrandHeader } from "../_components/brand-header";
import { WelcomeCard } from "../_components/welcome-card";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = { title: "Criar conta" };

/** Cadastro (Figma: "Cadastro"). Ao criar a conta, segue para o onboarding. */
export default function SignUpPage() {
  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-5 pt-2 pb-6 lg:flex-none lg:gap-6 lg:px-6 lg:pt-0 lg:pb-0">
        <WelcomeCard
          title="Criar conta"
          subtitle="Gratuito. Leva menos de um minuto."
          composition="cadastro"
        />

        <SurfaceCard>
          <SignUpForm />
        </SurfaceCard>

        <p className="mt-auto flex items-center justify-center gap-1 px-4 text-sm lg:px-0">
          Já tem cadastro?
          <Link
            href="/entrar"
            className="flex min-h-11 items-center font-semibold underline underline-offset-4"
          >
            Já tenho conta
          </Link>
        </p>
      </main>
    </>
  );
}
