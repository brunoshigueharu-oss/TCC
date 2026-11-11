import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { Profile } from "@/lib/data/perfil";
import { CountUp } from "./motion/count-up";

type CommunitySectionProps = {
  community: Profile["community"];
  username: string;
};

/** Números da participação na comunidade + link para o perfil público. */
export function CommunitySection({ community, username }: CommunitySectionProps) {
  const stats = [
    { label: "Posts publicados", value: community.posts },
    { label: "Respostas dadas", value: community.answers },
    { label: "Votos de útil recebidos", value: community.helpfulVotes },
  ];

  return (
    <section aria-labelledby="atividade-comunidade" className="flex flex-col lg:col-span-5">
      <SectionHeading id="atividade-comunidade" title="Na comunidade" href="/comunidade" tone="comunidade" />

      <dl className="mx-4 divide-y divide-linha lg:mx-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-[15px] text-texto-secundario">{stat.label}</dt>
            <dd className="font-mono text-2xl leading-none font-light tracking-[-0.04em] tabular-nums">
              <CountUp value={stat.value} format="twoDigits" duration={0.6} />
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href={`/comunidade/pessoas/${username}`}
        className="group mx-4 flex min-h-12 items-center justify-between gap-3 border-y border-linha text-sm font-semibold outline-none transition-colors hover:bg-superficie focus-visible:bg-superficie lg:mx-0 lg:-mx-3 lg:rounded-lg lg:border-b-0 lg:px-3"
      >
        Ver meu perfil público
        <ArrowUpRight
          aria-hidden
          className="size-4 text-texto-secundario transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-texto"
          strokeWidth={2}
        />
      </Link>
    </section>
  );
}
