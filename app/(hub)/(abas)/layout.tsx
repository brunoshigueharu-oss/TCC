import { BottomNav } from "@/components/bottom-nav";
import { MobileTopBar } from "@/components/mobile-top-bar";
import { SideNav } from "@/components/side-nav";
import { countUnreadNotifications } from "@/lib/data/notificacoes";
import { CURRENT_USERNAME, people } from "@/lib/data/pessoas";

/**
 * Telas com navegação principal. Celular: faixa com marca e busca, coluna de
 * 480px e barra inferior. Computador: barra lateral (recolhível) + conteúdo
 * até 1200px.
 */
export default function TabsLayout({ children }: LayoutProps<"/">) {
  const hasUnreadNotifications = countUnreadNotifications() > 0;
  const currentUser = people.find((person) => person.username === CURRENT_USERNAME);
  const user = currentUser ? { name: currentUser.name, level: currentUser.level, xp: currentUser.xp } : undefined;

  return (
    <div className="flex min-h-dvh flex-1">
      <SideNav hasUnreadNotifications={hasUnreadNotifications} user={user} />
      <div className="mx-auto flex w-full max-w-[480px] min-w-0 flex-1 flex-col bg-fundo lg:max-w-none">
        <MobileTopBar />
        <div data-shell="abas" className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-[1200px] lg:px-10 lg:pt-8 lg:pb-12">
          {children}
        </div>
        <BottomNav hasUnreadNotifications={hasUnreadNotifications} />
      </div>
    </div>
  );
}
