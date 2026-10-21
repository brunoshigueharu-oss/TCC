import { ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { Profile } from "@/lib/data/perfil";

type CommunitySectionProps = {
  community: Profile["community"];
  username: string;
};

/** Números da participação na comunidade + link para o perfil público. */
export function CommunitySection({ community, username }: CommunitySectionProps) {
  const stats = [
    { label: "Posts", value: community.posts },
    { label: "Respostas", value: community.answers },
    { label: "Votos de útil", value: community.helpfulVotes },
  ];

  return (
    <section aria-labelledby="atividade-comunidade" className="flex flex-col gap-2">
      <SectionHeading
        id="atividade-comunidade"
        title="Atividade na comunidade"
        href="/comunidade"
        icon={MessageCircle}
        tone="comunidade"
      />
      <SurfaceCard>
        <dl className="grid grid-cols-3 divide-x divide-linha py-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse items-center gap-1 px-2">
              <dt className="text-center text-xs text-texto-secundario">{stat.label}</dt>
              <dd className="font-display text-[22px] leading-none font-bold">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={`/comunidade/pessoas/${username}`}
          className="flex min-h-12 items-center gap-3 border-t border-linha px-4"
        >
          <span className="flex-1 text-sm font-semibold">Ver meu perfil público</span>
          <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} />
        </Link>
      </SurfaceCard>
    </section>
  );
}
