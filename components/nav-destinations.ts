import { BookOpen, House, User, Users, type LucideIcon } from "lucide-react";

export type NavDestination = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Rotas que deixam este destino marcado como ativo. */
  matches: string[];
};

/** Destinos principais do hub, usados na barra inferior e na lateral. */
export const navDestinations: NavDestination[] = [
  { label: "Home", href: "/inicio", icon: House, matches: ["/inicio"] },
  { label: "Comunidade", href: "/comunidade", icon: Users, matches: ["/comunidade"] },
  { label: "Educação", href: "/educacao", icon: BookOpen, matches: ["/educacao"] },
  { label: "Perfil", href: "/perfil", icon: User, matches: ["/perfil"] },
];

export function isActiveRoute(pathname: string, matches: string[]) {
  return matches.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
