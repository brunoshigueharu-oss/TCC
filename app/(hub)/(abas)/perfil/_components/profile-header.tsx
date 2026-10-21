import { Bell, ChevronRight, Settings, Trophy } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import type { Person } from "@/lib/data/pessoas";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PersonAvatar } from "./person-avatar";

/** Acima disso o selo mostra "99+". */
const BADGE_MAX = 99;

type ProfileHeaderProps = {
  person: Person;
  nextLevelXp: number;
  weeklyRank: number;
  unreadNotifications: number;
};

const iconButtonClass = "flex size-11 shrink-0 items-center justify-center rounded-xl bg-superficie";

/**
 * Topo de Meu perfil (Figma: "Cabeçalho de identidade" + "Identificação"):
 * marca, atalhos de avisos e configurações, avatar, nível, XP e o atalho
 * para o ranking de amigos.
 */
export function ProfileHeader({ person, nextLevelXp, weeklyRank, unreadNotifications }: ProfileHeaderProps) {
  const missingXp = Math.max(nextLevelXp - person.xp, 0);

  return (
    <header className="flex flex-col gap-5 rounded-b-[28px] bg-fundo px-4 pt-4 pb-5 ring-1 ring-linha/70 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-x-12 lg:gap-y-3 lg:rounded-[28px] lg:px-8 lg:py-7">
      <div className="flex items-center gap-2 lg:col-start-2 lg:row-start-1 lg:justify-end">
        <span aria-hidden className="size-[26px] shrink-0 rounded-full bg-superficie-forte lg:hidden" />
        <span className="flex-1 text-sm font-semibold lg:hidden">código &amp; design</span>
        <Link
          href="/perfil/notificacoes"
          aria-label={unreadNotifications > 0 ? `Notificações, ${unreadNotifications} não lidas` : "Notificações"}
          className={cn(iconButtonClass, "relative")}
        >
          <Bell aria-hidden className="size-5" strokeWidth={1.75} />
          {unreadNotifications > 0 ? (
            <span
              aria-hidden
              className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pratica px-1 text-[11px] font-bold text-texto ring-2 ring-fundo"
            >
              {unreadNotifications > BADGE_MAX ? `${BADGE_MAX}+` : unreadNotifications}
            </span>
          ) : null}
        </Link>
        <Link href="/perfil/configuracoes" aria-label="Configurações" className={iconButtonClass}>
          <Settings aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="flex items-center gap-4 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:gap-6 lg:self-center">
        <PersonAvatar name={person.name} tone={person.avatarTone} size="lg" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">{person.name}</h1>
          <p className="text-sm text-texto-secundario">
            @{person.username} · {person.role}
          </p>
          <p className="text-sm font-semibold">
            Nível {formatTwoDigits(person.level)} · {formatNumber(person.xp)} XP
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-superficie p-4 lg:col-start-2 lg:row-start-2">
        <ProgressBar value={person.xp} max={nextLevelXp} label="Progresso até o próximo nível" />
        <p className="text-xs text-texto-secundario">
          Faltam {formatNumber(missingXp)} XP para o nível {formatTwoDigits(person.level + 1)}.
        </p>
      </div>

      <Link
        href="/perfil/ranking"
        className="flex min-h-12 items-center gap-3 rounded-2xl px-4 ring-1 ring-linha lg:col-start-2 lg:row-start-3 lg:transition-colors lg:hover:bg-superficie"
      >
        <Trophy aria-hidden className="size-5" strokeWidth={1.75} />
        <span className="flex-1 text-[15px] font-semibold">Ranking de amigos</span>
        <span className="text-sm text-texto-secundario">{weeklyRank}º na semana</span>
        <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} />
      </Link>
    </header>
  );
}
