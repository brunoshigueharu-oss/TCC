"use client";

import { PenSquare, Search, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/app/_components/brand-mark";
import { UnreadDot } from "@/components/unread-dot";
import { cn } from "@/lib/utils";
import { isActiveRoute, navDestinations } from "./nav-destinations";

type SideLink = { label: string; href: string; icon: LucideIcon };

const secondaryLinks: SideLink[] = [{ label: "Busca", href: "/busca", icon: Search }];

/** Ferramentas que só existem no computador (grupo `(web)`). */
const toolLinks: SideLink[] = [{ label: "Criar minicurso", href: "/criar-minicurso", icon: PenSquare }];

type SideNavItemProps = SideLink & { isActive: boolean; hasDot?: boolean };

function SideNavItem({ label, href, icon: Icon, isActive, hasDot = false }: SideNavItemProps) {
  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        aria-label={hasDot ? `${label}, há notificações novas` : undefined}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
          isActive ? "bg-superficie text-texto" : "text-texto-secundario hover:bg-superficie hover:text-texto",
        )}
      >
        <span className="relative">
          <Icon
            aria-hidden
            className={cn("size-[22px]", isActive && "text-acao")}
            strokeWidth={isActive ? 2 : 1.75}
            fill={isActive ? "currentColor" : "none"}
          />
          {hasDot ? <UnreadDot /> : null}
        </span>
        {label}
      </Link>
    </li>
  );
}

/**
 * Navegação principal no computador (≥ lg): coluna fixa à esquerda com o
 * logo, os 4 destinos da barra inferior, a Busca e as ferramentas web. As
 * notificações moram no Perfil (bolinha no ícone). No celular fica escondida
 * e a `BottomNav` assume.
 */
export function SideNav({ hasUnreadNotifications }: { hasUnreadNotifications: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-8 border-r border-linha bg-fundo px-4 py-6 lg:flex">
      <BrandMark href="/inicio" className="px-3" />

      <nav aria-label="Navegação principal" className="flex flex-col gap-6">
        <ul className="flex flex-col gap-1">
          {navDestinations.map((destination) => (
            <SideNavItem
              key={destination.href}
              {...destination}
              isActive={isActiveRoute(pathname, destination.matches)}
              hasDot={destination.href === "/perfil" && hasUnreadNotifications}
            />
          ))}
        </ul>
        <ul className="flex flex-col gap-1 border-t border-linha pt-6">
          {secondaryLinks.map((link) => (
            <SideNavItem key={link.href} {...link} isActive={isActiveRoute(pathname, [link.href])} />
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <p className="px-3 text-xs font-semibold tracking-wide text-texto-secundario uppercase">Ferramentas</p>
        <ul className="flex flex-col gap-1">
          {toolLinks.map((link) => (
            <SideNavItem key={link.href} {...link} isActive={false} />
          ))}
        </ul>
      </div>
    </aside>
  );
}
