import { Bell, ChevronRight, ShieldCheck, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import { AccountForm } from "./_components/account-form";
import { DeleteAccountConfirm } from "./_components/delete-account-confirm";
import { PreferenceSwitches, type PreferenceItem } from "./_components/preference-switches";
import { getSettings } from "./_data-access/get-settings";

export const metadata: Metadata = { title: "Configurações" };

const notificationItems: PreferenceItem[] = [
  { key: "pushNotifications", label: "Notificações no celular" },
  { key: "inAppNotifications", label: "Avisos dentro do app" },
  { key: "emailNotifications", label: "Resumo semanal por e-mail" },
];

const privacyItems: PreferenceItem[] = [
  {
    key: "isProfilePublic",
    label: "Perfil público",
    description: "Outras pessoas veem seu nível, selos, posts e minicursos.",
  },
  {
    key: "isInFriendsRanking",
    label: "Aparecer no ranking de amigos",
    description: "Seu XP da semana e do mês entra na lista dos amigos.",
  },
  {
    key: "hasResearchConsent",
    label: "Uso dos dados para melhorar a plataforma",
    description: "Dados de uso anônimos, conforme o termo de consentimento.",
  },
];

/** Configurações da conta (Figma: "Configurações"). Tela sem barra inferior. */
export default async function SettingsPage({ searchParams }: PageProps<"/perfil/configuracoes">) {
  const { account, preferences } = await getSettings();
  const isConfirmingDelete = (await searchParams).excluir === "1";

  return (
    <>
      <BackBar href="/perfil" label="Configurações" />
      <main className="flex flex-col gap-7 pt-5 pb-8">
        <section aria-labelledby="dados-conta" className="flex flex-col gap-2">
          <SectionHeading id="dados-conta" title="Dados da conta" icon={UserRound} tone="acao" />
          <SurfaceCard>
            <AccountForm defaultValues={account} />
          </SurfaceCard>
        </section>

        <section aria-labelledby="notificacoes-config" className="flex flex-col gap-2">
          <SectionHeading id="notificacoes-config" title="Notificações" icon={Bell} tone="acao" />
          <SurfaceCard>
            <PreferenceSwitches items={notificationItems} initialValues={preferences} />
          </SurfaceCard>
        </section>

        <section aria-labelledby="privacidade" className="flex flex-col gap-2">
          <SectionHeading
            id="privacidade"
            title="Privacidade e consentimento"
            icon={ShieldCheck}
            tone="acao"
          />
          <SurfaceCard>
            <PreferenceSwitches items={privacyItems} initialValues={preferences} />
            <Link
              href="/consentimento"
              className="flex min-h-12 items-center gap-3 border-t border-linha px-4"
            >
              <span className="flex-1 text-sm font-semibold">Rever o termo de consentimento</span>
              <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} />
            </Link>
          </SurfaceCard>
        </section>

        <section aria-label="Sair ou excluir a conta" className="flex flex-col gap-3 px-4">
          <Link
            href="/entrar"
            className="flex h-12 items-center justify-center rounded-xl bg-texto text-[15px] font-semibold text-fundo transition-transform active:scale-[0.98]"
          >
            Sair da conta
          </Link>
          {isConfirmingDelete ? (
            <DeleteAccountConfirm />
          ) : (
            <Link
              href="/perfil/configuracoes?excluir=1"
              scroll={false}
              className="flex h-11 items-center justify-center rounded-xl text-sm font-semibold ring-1 ring-texto"
            >
              Excluir conta
            </Link>
          )}
          <p className="text-xs text-texto-secundario">
            Ao excluir a conta, seu progresso, selos e XP são apagados. Posts e respostas na
            comunidade ficam anônimos.
          </p>
        </section>
      </main>
    </>
  );
}
