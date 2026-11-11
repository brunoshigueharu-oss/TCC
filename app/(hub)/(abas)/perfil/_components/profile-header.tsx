import { Bell, Settings } from "lucide-react";
import Link from "next/link";

import type { Person } from "@/lib/data/pessoas";

/** Acima disso o contador mostra "99+". */
const BADGE_MAX = 99;

type ProfileHeaderProps = {
  person: Person;
  memberSince: string;
  unreadNotifications: number;
};

const iconLinkClass =
  "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-linha text-texto-secundario outline-none transition-[color,border-color,background-color,transform] duration-200 hover:border-texto hover:bg-superficie hover:text-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-95";

function getInitials(name: string) {
  const [first = "", last = ""] = name.split(" ");
  return `${first.charAt(0)}${last.charAt(0)}`;
}

/**
 * Cabeçalho de pessoa: monograma em linha fina, nome grande e apertado, e os
 * atalhos de avisos e configurações. Sem cartão e sem cor: só tipografia.
 */
export function ProfileHeader({ person, memberSince, unreadNotifications }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-6 px-4 pt-8 pb-6 lg:px-0 lg:pt-4 lg:pb-8">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
          <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
          Perfil
          <span className="font-mono font-normal tracking-normal normal-case">desde {memberSince}</span>
        </p>
        <nav aria-label="Atalhos do perfil" className="flex items-center gap-2">
          <Link
            href="/perfil/notificacoes"
            aria-label={unreadNotifications > 0 ? `Notificações, ${unreadNotifications} não lidas` : "Notificações"}
            className={iconLinkClass}
          >
            <Bell aria-hidden className="size-[18px]" strokeWidth={1.75} />
            {unreadNotifications > 0 ? (
              <span
                aria-hidden
                className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-texto px-1 font-mono text-[10px] font-medium text-fundo tabular-nums ring-2 ring-fundo"
              >
                {unreadNotifications > BADGE_MAX ? `${BADGE_MAX}+` : unreadNotifications}
              </span>
            ) : null}
          </Link>
          <Link href="/perfil/configuracoes" aria-label="Configurações" className={iconLinkClass}>
            <Settings aria-hidden className="size-[18px]" strokeWidth={1.75} />
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4 lg:gap-7">
        <span
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center rounded-full border border-texto font-display text-xl font-medium tracking-[-0.02em] lg:size-24 lg:text-[32px]"
        >
          {getInitials(person.name)}
        </span>
        <div className="flex min-w-0 flex-col gap-1.5 lg:gap-2">
          <h1 className="animate-blur-in font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] text-balance motion-reduce:animate-none lg:text-[60px]">
            {person.name}
          </h1>
          <p className="text-[15px] text-texto-secundario">
            <span className="font-mono text-sm">@{person.username}</span> · {person.role}
          </p>
        </div>
      </div>
    </header>
  );
}
