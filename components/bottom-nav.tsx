"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UnreadDot } from "@/components/unread-dot";
import { cn } from "@/lib/utils";
import { isActiveRoute, navDestinations } from "./nav-destinations";

/** No celular, a Busca deixa a Home marcada como ativa. */
const homeExtraMatches = ["/busca"];

type BottomNavProps = {
  /** Mostra a bolinha no Perfil, onde ficam as notificações. */
  hasUnreadNotifications: boolean;
};

/** Barra de navegação principal no celular (Figma: "Navegação principal"). */
export function BottomNav({ hasUnreadNotifications }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-10 border-t border-linha bg-fundo px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {navDestinations.map(({ label, href, icon: Icon, matches }) => {
          const routes = href === "/inicio" ? [...matches, ...homeExtraMatches] : matches;
          const isActive = isActiveRoute(pathname, routes);
          const hasDot = href === "/perfil" && hasUnreadNotifications;

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                aria-label={hasDot ? `${label}, há notificações novas` : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-texto" : "text-texto-secundario hover:text-texto",
                )}
              >
                {/* Ativo = ícone preenchido, como no Spotify. */}
                <span className="relative">
                  <Icon
                    aria-hidden
                    className={cn("size-6", isActive && "text-acao")}
                    strokeWidth={isActive ? 2 : 1.75}
                    fill={isActive ? "currentColor" : "none"}
                  />
                  {hasDot ? <UnreadDot /> : null}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
