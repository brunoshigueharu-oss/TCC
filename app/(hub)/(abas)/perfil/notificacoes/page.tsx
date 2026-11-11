import type { Metadata } from "next";
import Link from "next/link";

import { BackBar } from "@/components/back-bar";
import { formatTwoDigits } from "@/lib/format";
import { NotificationList } from "./_components/notification-list";
import { getNotifications } from "./_data-access/get-notifications";

export const metadata: Metadata = { title: "Notificações" };

/**
 * Notificações (Figma: "Notificações"), agrupadas em hoje e esta semana. Mora
 * dentro do Perfil: a bolinha no ícone de Perfil avisa que há algo novo.
 */
export default async function NotificationsPage({ searchParams }: PageProps<"/perfil/notificacoes">) {
  const isAllRead = (await searchParams).lidas === "1";
  const { unreadCount, today, thisWeek } = await getNotifications({ isAllRead });

  return (
    <>
      <BackBar href="/perfil" label="Notificações" />
      <main className="flex flex-col gap-10 pb-10 lg:pb-0">
        <header className="flex items-end justify-between gap-4 px-4 pt-8 lg:px-0 lg:pt-10">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
              <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
              Avisos
            </p>
            <p aria-live="polite" className="flex items-baseline gap-3">
              <span className="font-mono text-[72px] leading-[0.85] font-extralight tracking-[-0.06em] tabular-nums lg:text-[96px]">
                {formatTwoDigits(unreadCount)}
              </span>
              <span className="font-display text-xl font-medium tracking-[-0.02em] text-texto-secundario">
                {unreadCount === 0 ? "tudo em dia" : unreadCount === 1 ? "não lida" : "não lidas"}
              </span>
            </p>
          </div>
          {unreadCount > 0 ? (
            <Link
              href="/perfil/notificacoes?lidas=1"
              scroll={false}
              className="flex min-h-11 items-center text-sm font-semibold underline decoration-linha underline-offset-4 outline-none transition-colors hover:decoration-texto focus-visible:decoration-texto"
            >
              Marcar todas como lidas
            </Link>
          ) : null}
        </header>
        <NotificationList id="hoje" title="Hoje" items={today} />
        <NotificationList id="semana" title="Esta semana" items={thisWeek} />
      </main>
    </>
  );
}
