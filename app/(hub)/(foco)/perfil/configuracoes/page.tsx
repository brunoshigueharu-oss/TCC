import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BackBar } from "@/components/back-bar";
import { AccountForm } from "./_components/account-form";
import { DeleteAccountConfirm } from "./_components/delete-account-confirm";
import { PreferenceSwitches, type PreferenceItem } from "./_components/preference-switches";
import { SettingsGroup } from "./_components/settings-group";
import { ThemeChoice } from "./_components/theme-choice";
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

const rowLinkClass =
  "group flex min-h-14 items-center justify-between gap-3 text-[15px] font-medium outline-none transition-colors hover:text-texto focus-visible:underline";

/** Configurações da conta (Figma: "Configurações"). Tela sem barra inferior. */
export default async function SettingsPage({ searchParams }: PageProps<"/perfil/configuracoes">) {
  const { account, preferences } = await getSettings();
  const isConfirmingDelete = (await searchParams).excluir === "1";

  return (
    <div className="flex flex-1 flex-col bg-fundo">
      <BackBar href="/perfil" label="Configurações" />
      <main className="flex flex-col gap-10 pt-8 pb-12 lg:px-10 lg:pt-12">
        <header className="flex flex-col gap-3 px-4 lg:px-0">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
            Perfil
          </p>
          <h1 className="font-display text-[40px] leading-[1.02] font-medium tracking-[-0.04em] lg:text-[56px]">
            Configurações
          </h1>
        </header>

        <SettingsGroup
          id="dados-conta"
          index="01"
          title="Conta"
          description="Como você aparece para a turma e onde recebe os avisos."
        >
          <AccountForm defaultValues={account} />
        </SettingsGroup>

        <SettingsGroup id="aparencia" index="02" title="Aparência" description="Escolha o tema do hub.">
          <ThemeChoice />
        </SettingsGroup>

        <SettingsGroup
          id="notificacoes-config"
          index="03"
          title="Notificações"
          description="Respostas às suas dúvidas, avaliações de prática e novidades da trilha."
        >
          <PreferenceSwitches items={notificationItems} initialValues={preferences} />
        </SettingsGroup>

        <SettingsGroup
          id="privacidade"
          index="04"
          title="Privacidade"
          description="O que outras pessoas veem e como seus dados são usados."
        >
          <PreferenceSwitches items={privacyItems} initialValues={preferences} />
          <Link href="/consentimento" className={rowLinkClass}>
            Rever o termo de consentimento
            <ArrowUpRight
              aria-hidden
              className="size-4 text-texto-secundario transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </Link>
        </SettingsGroup>

        <SettingsGroup
          id="sessao"
          index="05"
          title="Sessão"
          description="Ao excluir a conta, seu progresso, selos e XP são apagados. Posts e respostas na comunidade ficam anônimos."
        >
          <Link href="/entrar" className={rowLinkClass}>
            Sair da conta
            <ArrowUpRight
              aria-hidden
              className="size-4 text-texto-secundario transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </Link>
          <div className="py-3">
            {isConfirmingDelete ? (
              <DeleteAccountConfirm />
            ) : (
              <Link
                href="/perfil/configuracoes?excluir=1"
                scroll={false}
                className="flex min-h-11 items-center text-[15px] font-medium text-texto-secundario underline decoration-linha underline-offset-4 outline-none transition-colors hover:text-texto hover:decoration-texto focus-visible:decoration-texto"
              >
                Excluir conta
              </Link>
            )}
          </div>
        </SettingsGroup>
      </main>
    </div>
  );
}
