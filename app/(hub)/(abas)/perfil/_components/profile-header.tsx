import { Bell, ChevronRight, Settings, Trophy } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import type { Person } from "@/lib/data/pessoas";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";

type ProfileHeaderProps = {
  person: Person;
  nextLevelXp: number;
  weeklyRank: number;
};

const iconButtonClass = "flex size-11 shrink-0 items-center justify-center rounded-xl bg-superficie";

/**
 * Topo de Meu perfil (Figma: "Cabeçalho de identidade" + "Identificação"):
 * marca, atalhos de avisos e configurações, avatar, nível, XP e o atalho
 * para o ranking de amigos.
 */
export function ProfileHeader({ person, nextLevelXp, weeklyRank }: ProfileHeaderProps) {
  const missingXp = Math.max(nextLevelXp - person.xp, 0);

  return (
    <header className="flex flex-col gap-5 rounded-b-[28px] bg-fundo px-4 pt-4 pb-5 ring-1 ring-linha/70">
      <div className="flex items-center gap-2">
        <span aria-hidden className="size-[26px] shrink-0 rounded-full bg-superficie-forte" />
        <span className="flex-1 text-sm font-semibold">código &amp; design</span>
        <Link href="/notificacoes" aria-label="Notificações" className={iconButtonClass}>
          <Bell aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
        <Link href="/perfil/configuracoes" aria-label="Configurações" className={iconButtonClass}>
          <Settings aria-hidden className="size-5" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <PersonAvatar name={person.name} tone={person.avatarTone} size="lg" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-display text-[22px] leading-tight font-bold">{person.name}</h1>
          <p className="text-sm text-texto-secundario">
            @{person.username} · {person.role}
          </p>
          <p className="text-sm font-semibold">
            Nível {formatTwoDigits(person.level)} · {formatNumber(person.xp)} XP
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-superficie p-4">
        <ProgressBar value={person.xp} max={nextLevelXp} label="Progresso até o próximo nível" />
        <p className="text-xs text-texto-secundario">
          Faltam {formatNumber(missingXp)} XP para o nível {formatTwoDigits(person.level + 1)}.
        </p>
      </div>

      <Link
        href="/perfil/ranking"
        className="flex min-h-12 items-center gap-3 rounded-2xl px-4 ring-1 ring-linha"
      >
        <Trophy aria-hidden className="size-5" strokeWidth={1.75} />
        <span className="flex-1 text-[15px] font-semibold">Ranking de amigos</span>
        <span className="text-sm text-texto-secundario">{weeklyRank}º na semana</span>
        <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} />
      </Link>
    </header>
  );
}
