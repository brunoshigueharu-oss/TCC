import { BottomNav } from "@/components/bottom-nav";
import { SideNav } from "@/components/side-nav";
import { countUnreadNotifications } from "@/lib/data/notificacoes";

/**
 * Telas com navegação principal. Celular: coluna de 480px + barra inferior.
 * Computador: barra lateral + conteúdo até 1200px.
 */
export default function TabsLayout({ children }: LayoutProps<"/">) {
  const hasUnreadNotifications = countUnreadNotifications() > 0;

  return (
    <div className="flex min-h-dvh flex-1">
      <SideNav hasUnreadNotifications={hasUnreadNotifications} />
      <div className="mx-auto flex w-full max-w-[480px] min-w-0 flex-1 flex-col bg-superficie lg:max-w-none">
        <div data-shell="abas" className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-[1200px] lg:px-10 lg:pt-8 lg:pb-12">
          {children}
        </div>
        <BottomNav hasUnreadNotifications={hasUnreadNotifications} />
      </div>
    </div>
  );
}
