import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Person } from "@/lib/data/pessoas";
import { formatNumber, formatTwoDigits } from "@/lib/format";
import { PersonAvatar } from "../../../_components/person-avatar";

type PersonSummaryProps = {
  person: Person;
  isCurrentUser: boolean;
  postsCount: number;
  acceptedCount: number;
};

/** Cabeçalho do perfil público: monograma, nome grande e números em linha. */
export function PersonSummary({
  person,
  isCurrentUser,
  postsCount,
  acceptedCount,
}: PersonSummaryProps) {
  const stats = [
    { label: "Nível", value: formatTwoDigits(person.level) },
    { label: "XP", value: formatNumber(person.xp) },
    { label: "Posts", value: formatTwoDigits(postsCount) },
    { label: "Aceitas", value: formatTwoDigits(acceptedCount) },
  ];

  return (
    <header className="flex flex-col gap-6 border-b border-linha px-4 pt-8 pb-6 lg:px-0 lg:pt-6 lg:pb-8">
      <div className="flex items-end gap-5">
        <PersonAvatar name={person.name} size="lg" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
            <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
            {person.isLookingForCollaborators
              ? "Procurando colaboradores"
              : "Pessoa da turma"}
          </p>
          <h1 className="font-display text-[34px] leading-[1.02] font-medium tracking-[-0.04em] lg:text-[52px]">
            {person.name}
          </h1>
          <p className="font-mono text-xs text-texto-secundario">
            @{person.username} · {person.role}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-4 border-t border-linha pt-5 lg:max-w-[560px]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dt className="text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase">
              {stat.label}
            </dt>
            <dd className="font-display text-[26px] leading-none font-light tabular-nums lg:text-[32px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <Link
        href={isCurrentUser ? "/perfil" : "/perfil/ranking"}
        className="group/link flex w-fit items-center gap-1.5 text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline"
      >
        {isCurrentUser
          ? "Este é você · ir para Meu perfil"
          : "Ver no ranking de amigos"}
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          strokeWidth={2}
        />
      </Link>
    </header>
  );
}
