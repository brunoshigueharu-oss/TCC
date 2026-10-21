"use client";

import { BookOpen, House, User, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavDestination = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Rotas que deixam este destino marcado como ativo. */
  matches: string[];
};

const destinations: NavDestination[] = [
  { label: "Home", href: "/inicio", icon: House, matches: ["/inicio", "/notificacoes", "/busca"] },
  { label: "Comunidade", href: "/comunidade", icon: Users, matches: ["/comunidade"] },
  { label: "Educação", href: "/educacao", icon: BookOpen, matches: ["/educacao"] },
  { label: "Perfil", href: "/perfil", icon: User, matches: ["/perfil"] },
];

function isActiveRoute(pathname: string, matches: string[]) {
  return matches.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/** Barra de navegação principal (Figma: "Navegação principal"). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="sticky bottom-0 z-10 border-t border-linha bg-fundo px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      <ul className="grid grid-cols-4">
        {destinations.map(({ label, href, icon: Icon, matches }) => {
          const isActive = isActiveRoute(pathname, matches);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-texto" : "text-texto-secundario hover:text-texto",
                )}
              >
                {/* Ativo = ícone preenchido, como no Spotify. */}
                <Icon
                  aria-hidden
                  className={cn("size-6", isActive && "text-acao")}
                  strokeWidth={isActive ? 2 : 1.75}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
