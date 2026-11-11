"use client";

import { PanelLeftClose, PanelLeftOpen, PenSquare, Shield, type LucideIcon } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { CommandPaletteTrigger } from "@/components/command-palette/command-palette-trigger";
import { ShortcutKeys } from "@/components/command-palette/shortcut-keys";
import { toggleNavCollapsed, useIsNavCollapsed } from "@/components/side-nav-state";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { UnreadDot } from "@/components/unread-dot";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { isActiveRoute, navDestinations } from "./nav-destinations";

type SideLink = { label: string; href: string; icon: LucideIcon };

/** Ferramentas que só existem no computador (grupo `(web)`). */
const toolLinks: SideLink[] = [
  { label: "Criar minicurso", href: "/criar-minicurso", icon: PenSquare },
  { label: "Moderação", href: "/moderacao", icon: Shield },
];

/** Atalho "G + letra" de cada destino (mesmos da paleta de comandos). */
const destinationKeys: Record<string, string> = {
  "/inicio": "H",
  "/comunidade": "C",
  "/educacao": "E",
  "/perfil": "P",
};

const itemClass =
  "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-texto nav-recolhida:justify-center nav-recolhida:px-0";

type SideNavItemProps = SideLink & {
  isActive: boolean;
  hasDot?: boolean;
  isCollapsed: boolean;
  shortcutKey?: string;
};

function SideNavItem({ label, href, icon: Icon, isActive, hasDot = false, isCollapsed, shortcutKey }: SideNavItemProps) {
  return (
    <li>
      <Tooltip
        label={label}
        side="right"
        disabled={!isCollapsed}
        shortcut={shortcutKey ? <ShortcutKeys shortcut={{ keys: ["G", shortcutKey], isSequence: true }} /> : undefined}
      >
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          aria-label={hasDot ? `${label}, há notificações novas` : isCollapsed ? label : undefined}
          className={cn(itemClass, isActive ? "text-texto" : "text-texto-secundario hover:bg-superficie/70 hover:text-texto")}
        >
          {isActive ? (
            <motion.span
              layoutId="side-nav-ativo"
              aria-hidden
              className="absolute inset-0 rounded-xl bg-superficie"
              transition={{ type: "spring", stiffness: 520, damping: 42 }}
            >
              <span className="absolute top-1/2 -left-4 h-5 w-0.5 -translate-y-1/2 rounded-full bg-texto nav-recolhida:-left-3" />
            </motion.span>
          ) : null}
          <span className="relative">
            <Icon aria-hidden className="size-5" strokeWidth={isActive ? 2 : 1.75} />
            {hasDot ? <UnreadDot /> : null}
          </span>
          <span className="relative nav-recolhida:sr-only">{label}</span>
        </Link>
      </Tooltip>
    </li>
  );
}

type SideNavProps = {
  hasUnreadNotifications: boolean;
  /** Pessoa logada, para o bloco do rodapé. */
  user?: { name: string; level: number; xp: number };
};

/**
 * Navegação principal no computador (≥ lg): coluna fixa à esquerda com a
 * marca, a busca (paleta ⌘K), os 4 destinos, as ferramentas web, o tema e a
 * pessoa logada. Recolhe para só ícones (⌘B ou o botão do topo) e lembra a
 * escolha; recolhida, cada item mostra o nome numa dica. No celular fica
 * escondida e a `BottomNav` assume.
 */
export function SideNav({ hasUnreadNotifications, user }: SideNavProps) {
  const pathname = usePathname();
  const isCollapsed = useIsNavCollapsed();
  const CollapseIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;
  const collapseLabel = isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral";

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delay={250}>
        <aside
          data-side-nav
          className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r border-linha bg-fundo px-4 py-5 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex nav-recolhida:w-[76px] nav-recolhida:px-3"
        >
          <div className="flex items-center justify-between gap-2 pl-3 nav-recolhida:flex-col nav-recolhida:pl-0">
            <BrandMark href="/inicio" />
            <Tooltip label={collapseLabel} side="right" shortcut={<ShortcutKeys shortcut={{ keys: ["mod", "B"] }} />}>
              <button
                type="button"
                onClick={toggleNavCollapsed}
                aria-label={collapseLabel}
                aria-expanded={!isCollapsed}
                className="flex size-9 items-center justify-center rounded-lg text-texto-secundario outline-none transition-colors hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto"
              >
                <CollapseIcon aria-hidden className="size-[18px]" strokeWidth={1.75} />
              </button>
            </Tooltip>
          </div>

          <div className="nav-recolhida:hidden">
            <CommandPaletteTrigger />
          </div>
          <div className="hidden justify-center nav-recolhida:flex">
            <Tooltip label="Buscar" side="right" shortcut={<ShortcutKeys shortcut={{ keys: ["mod", "K"] }} />}>
              <span className="flex">
                <CommandPaletteTrigger variant="icon" />
              </span>
            </Tooltip>
          </div>

          <nav aria-label="Navegação principal" className="flex flex-col gap-6">
            <ul className="flex flex-col gap-1">
              {navDestinations.map((destination) => (
                <SideNavItem
                  key={destination.href}
                  {...destination}
                  isCollapsed={isCollapsed}
                  shortcutKey={destinationKeys[destination.href]}
                  isActive={isActiveRoute(pathname, destination.matches)}
                  hasDot={destination.href === "/perfil" && hasUnreadNotifications}
                />
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            <p className="px-3 text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase nav-recolhida:sr-only">
              Ferramentas
            </p>
            <ul className="flex flex-col gap-1">
              {toolLinks.map((link) => (
                <SideNavItem key={link.href} {...link} isCollapsed={isCollapsed} isActive={isActiveRoute(pathname, [link.href])} />
              ))}
              <li>
                <Tooltip label="Mudar tema" side="right" disabled={!isCollapsed} shortcut={<ShortcutKeys shortcut={{ keys: ["alt", "T"] }} />}>
                  <span className="flex">
                    <ThemeToggle variant="row" className="nav-recolhida:justify-center nav-recolhida:px-0" />
                  </span>
                </Tooltip>
              </li>
            </ul>

            {user ? (
              <Link
                href="/perfil"
                className="mt-2 flex min-h-14 items-center gap-3 rounded-xl border-t border-linha px-3 pt-4 outline-none transition-colors hover:text-texto focus-visible:ring-2 focus-visible:ring-texto nav-recolhida:justify-center nav-recolhida:px-0"
                aria-label={`${user.name}, nível ${user.level}. Abrir perfil`}
              >
                <UserAvatar name={user.name} />
                <span className="flex min-w-0 flex-col nav-recolhida:hidden">
                  <span className="truncate text-sm font-semibold">{user.name}</span>
                  <span className="font-mono text-[11px] text-texto-secundario tabular-nums">
                    NÍV {String(user.level).padStart(2, "0")} · {user.xp.toLocaleString("pt-BR")} XP
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </aside>
      </TooltipProvider>
    </MotionConfig>
  );
}
