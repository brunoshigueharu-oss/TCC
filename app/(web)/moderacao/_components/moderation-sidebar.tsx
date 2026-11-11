import { Flag, type LucideIcon, Shield, UserRound, Users } from "lucide-react";
import Link from "next/link";

import { formatTwoDigits } from "@/lib/format";

type SidebarItem = { label: string; icon: LucideIcon };

/** Áreas do painel que ainda não existem no protótipo. */
const upcomingItems: SidebarItem[] = [
  { label: "Posts", icon: Users },
  { label: "Usuários", icon: UserRound },
  { label: "Papéis", icon: Shield },
];

type ModerationSidebarProps = {
  pendingCount: number;
};

/**
 * Menu do painel do moderador. Só "Denúncias" funciona no protótipo; os outros
 * itens aparecem desativados, com "em breve". No celular vira uma faixa
 * horizontal.
 */
export function ModerationSidebar({ pendingCount }: ModerationSidebarProps) {
  return (
    <nav aria-label="Painel do moderador" className="flex flex-col gap-3 pt-6 lg:sticky lg:top-16 lg:self-start lg:py-10 lg:pr-6">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">Painel</p>
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        <li className="shrink-0">
          <Link
            href="/moderacao"
            aria-current="page"
            className="relative flex min-h-11 items-center gap-3 rounded-lg bg-superficie px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-texto"
          >
            <Flag aria-hidden className="size-4" strokeWidth={1.75} />
            Denúncias
            <span className="ml-auto font-mono text-[11px] font-medium tabular-nums">
              {formatTwoDigits(pendingCount)}
              <span className="sr-only"> pendentes</span>
            </span>
          </Link>
        </li>
        {upcomingItems.map(({ label, icon: Icon }) => (
          <li key={label} className="shrink-0">
            <span
              aria-disabled="true"
              className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-desativado"
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              {label}
              <span className="ml-auto hidden font-mono text-[10px] uppercase lg:inline">em breve</span>
              <span className="sr-only lg:hidden">(em breve)</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
