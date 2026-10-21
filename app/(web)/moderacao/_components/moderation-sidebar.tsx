import { Flag, type LucideIcon, Shield, UserRound, Users } from "lucide-react";
import Link from "next/link";

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
 * itens aparecem desativados. No celular vira uma faixa horizontal.
 */
export function ModerationSidebar({ pendingCount }: ModerationSidebarProps) {
  return (
    <nav aria-label="Painel do moderador" className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
        Painel do moderador
      </p>
      <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        <li className="shrink-0">
          <Link
            href="/moderacao"
            aria-current="page"
            className="flex min-h-11 items-center gap-3 rounded-xl bg-fundo px-3 text-sm font-semibold ring-1 ring-texto"
          >
            <Flag aria-hidden className="size-4" strokeWidth={2} />
            Denúncias
            <span className="ml-auto rounded-md bg-texto px-1.5 py-0.5 text-xs font-bold text-fundo">
              {pendingCount}
            </span>
          </Link>
        </li>
        {upcomingItems.map(({ label, icon: Icon }) => (
          <li key={label} className="shrink-0">
            <span
              aria-disabled="true"
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-desativado"
            >
              <Icon aria-hidden className="size-4" strokeWidth={2} />
              {label}
              <span className="sr-only">(em breve)</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
