import { CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BackBar } from "@/components/back-bar";
import { NotificationList } from "./_components/notification-list";
import { getNotifications } from "./_data-access/get-notifications";

export const metadata: Metadata = { title: "Notificações" };

function formatUnread(count: number) {
  if (count === 0) return "Tudo em dia";
  return count === 1 ? "1 não lida" : `${count} não lidas`;
}

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
      <main className="flex flex-col gap-7 pt-4 pb-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-6 lg:pb-0">
        <div className="-mb-3 flex min-h-11 items-center justify-between gap-3 px-4 lg:col-span-2 lg:mb-0 lg:px-0">
          <p className="text-sm font-semibold" aria-live="polite">
            {formatUnread(unreadCount)}
          </p>
          {unreadCount > 0 ? (
            <Link
              href="/perfil/notificacoes?lidas=1"
              scroll={false}
              className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
            >
              Marcar todas como lidas
            </Link>
          ) : null}
        </div>
        <NotificationList id="hoje" title="Hoje" icon={Clock} items={today} />
        <NotificationList id="semana" title="Esta semana" icon={CalendarDays} items={thisWeek} />
      </main>
    </>
  );
}
