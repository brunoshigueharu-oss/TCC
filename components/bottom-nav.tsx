"use client";

import { motion, MotionConfig } from "motion/react";
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

/**
 * Barra de navegação principal no celular. O item ativo ganha uma régua fina
 * no topo que desliza entre os destinos (motion `layoutId`) e o ícone
 * preenchido; o toque encolhe o ícone por um instante. A busca/paleta fica
 * no botão de lupa do cabeçalho (`MobileTopBar`).
 */
export function BottomNav({ hasUnreadNotifications }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <nav
        aria-label="Navegação principal"
        className="sticky bottom-0 z-10 border-t border-linha bg-fundo/90 px-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
      >
        <ul className="grid grid-cols-4">
          {navDestinations.map(({ label, href, icon: Icon, matches }) => {
            const routes = href === "/inicio" ? [...matches, ...homeExtraMatches] : matches;
            const isActive = isActiveRoute(pathname, routes);
            const hasDot = href === "/perfil" && hasUnreadNotifications;

            return (
              <li key={href} className="relative">
                {isActive ? (
                  <motion.span
                    layoutId="bottom-nav-ativo"
                    aria-hidden
                    className="absolute top-[-1px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-texto"
                    transition={{ type: "spring", stiffness: 520, damping: 40 }}
                  />
                ) : null}
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={hasDot ? `${label}, há notificações novas` : undefined}
                  className={cn(
                    "group flex min-h-14 flex-col items-center justify-center gap-1 pt-2 text-[11px] font-medium outline-none transition-colors duration-200 [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-inset",
                    isActive ? "text-texto" : "text-texto-secundario hover:text-texto",
                  )}
                >
                  <span className="relative transition-transform duration-150 ease-out group-active:scale-[0.86]">
                    <Icon
                      aria-hidden
                      className="size-6"
                      strokeWidth={isActive ? 2 : 1.75}
                      fill={isActive ? "currentColor" : "none"}
                      fillOpacity={isActive ? 0.12 : 0}
                    />
                    {hasDot ? <UnreadDot /> : null}
                  </span>
                  <span className={cn("transition-[font-weight]", isActive && "font-semibold")}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
