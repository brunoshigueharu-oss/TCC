import "server-only";

import { countUnreadNotifications, notifications, type HubNotification } from "@/lib/data/notificacoes";

/**
 * Avisos da pessoa logada, agrupados por período. No protótipo, "marcar todas
 * como lidas" é só um estado da URL (`/perfil/notificacoes?lidas=1`); na versão real vira uma
 * Server Action que grava no módulo de notificações.
 */
export async function getNotifications({ isAllRead }: { isAllRead: boolean }) {
  const items: HubNotification[] = isAllRead
    ? notifications.map((item) => ({ ...item, isUnread: false }))
    : notifications;

  return {
    unreadCount: countUnreadNotifications(items),
    today: items.filter((item) => item.period === "hoje"),
    thisWeek: items.filter((item) => item.period === "semana"),
  };
}
