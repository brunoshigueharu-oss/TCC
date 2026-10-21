import { Bell, CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { NotificationList } from "./_components/notification-list";
import { getNotifications } from "./_data-access/get-notifications";

export const metadata: Metadata = { title: "Notificações" };

function formatUnread(count: number) {
  if (count === 0) return "Tudo em dia";
  return count === 1 ? "1 não lida" : `${count} não lidas`;
}

/** Notificações (Figma: "Notificações"), agrupadas em hoje e esta semana. */
export default async function NotificationsPage({ searchParams }: PageProps<"/notificacoes">) {
  const isAllRead = (await searchParams).lidas === "1";
  const { unreadCount, today, thisWeek } = await getNotifications({ isAllRead });

  return (
    <>
      <PageHeader title="Notificações" icon={Bell} tone="acao" hasNotificationsLink={false}>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p className="text-sm font-semibold" aria-live="polite">
            {formatUnread(unreadCount)}
          </p>
          {unreadCount > 0 ? (
            <Link
              href="/notificacoes?lidas=1"
              scroll={false}
              className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
            >
              Marcar todas como lidas
            </Link>
          ) : null}
        </div>
      </PageHeader>

      <main className="flex flex-col gap-7 pt-6 pb-8">
        <NotificationList id="hoje" title="Hoje" icon={Clock} items={today} />
        <NotificationList id="semana" title="Esta semana" icon={CalendarDays} items={thisWeek} />
      </main>
    </>
  );
}
