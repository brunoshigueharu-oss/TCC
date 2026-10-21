import { Bell, BookOpen, Target, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Selo some acima deste número e vira "99+". */
const BADGE_MAX = 99;

type Shortcut = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Classe literal da cor do quadrado (o Tailwind não lê nomes montados). */
  toneClass: string;
};

const shortcuts: Shortcut[] = [
  { label: "Trilha", href: "/educacao", icon: BookOpen, toneClass: "bg-trilha" },
  { label: "Praticar", href: "/educacao/praticar", icon: Target, toneClass: "bg-pratica" },
  { label: "Comunidade", href: "/comunidade", icon: Users, toneClass: "bg-comunidade" },
  { label: "Avisos", href: "/notificacoes", icon: Bell, toneClass: "bg-acao" },
];

type ShortcutsProps = {
  unreadNotifications: number;
  className?: string;
};

/** Quatro atalhos quadrados coloridos, um por pilar (+ avisos com selo). */
export function Shortcuts({ unreadNotifications, className }: ShortcutsProps) {
  const badge = unreadNotifications > BADGE_MAX ? `${BADGE_MAX}+` : String(unreadNotifications);

  return (
    <nav aria-label="Atalhos" className={cn("relative", className)}>
      <ul className="grid grid-cols-4">
        {shortcuts.map(({ label, href, icon: Icon, toneClass }) => {
          const hasBadge = href === "/notificacoes" && unreadNotifications > 0;

          return (
            <li key={label}>
              <Link
                href={href}
                aria-label={hasBadge ? `${label}, ${unreadNotifications} não lidos` : undefined}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "relative flex size-[72px] items-center justify-center rounded-[22px] border-[3px] border-fundo shadow-[0_2px_8px_rgb(27_31_59/0.12)] transition-transform group-active:scale-95",
                    toneClass,
                  )}
                >
                  <Icon aria-hidden className="size-8 text-texto" strokeWidth={1.75} />
                  {hasBadge ? (
                    <span
                      aria-hidden
                      className="absolute -top-2 -right-2 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-fundo bg-texto px-1.5 text-xs font-bold text-fundo"
                    >
                      {badge}
                    </span>
                  ) : null}
                </span>
                <span className="text-[13px] font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
