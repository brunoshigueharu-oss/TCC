import { ActionLink } from "@/components/action-link";
import { SurfaceCard } from "@/components/surface-card";
import type { Person } from "@/lib/data/pessoas";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "./person-avatar";

type PersonSummaryProps = {
  person: Person;
  isCurrentUser: boolean;
};

/** Cartão de identificação do perfil público (Figma: "Identificação"). */
export function PersonSummary({ person, isCurrentUser }: PersonSummaryProps) {
  const [topBadge] = person.badges;

  return (
    <SurfaceCard className="flex flex-col gap-4 p-4">
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

      {topBadge || person.isLookingForCollaborators ? (
        <ul className="flex flex-wrap gap-2">
          {topBadge ? (
            <li className="rounded-full bg-trilha px-3 py-1 text-xs font-semibold">
              {topBadge.title} · {topBadge.level}
            </li>
          ) : null}
          {person.isLookingForCollaborators ? (
            <li className="rounded-full bg-comunidade/15 px-3 py-1 text-xs font-semibold">
              Procurando colaboradores
            </li>
          ) : null}
        </ul>
      ) : null}

      {isCurrentUser ? (
        <ActionLink href="/perfil" variant="secondary">
          Este é você · Ir para Meu perfil
        </ActionLink>
      ) : (
        <ActionLink href="/perfil/ranking" variant="secondary">
          Ver no ranking de amigos
        </ActionLink>
      )}
    </SurfaceCard>
  );
}
