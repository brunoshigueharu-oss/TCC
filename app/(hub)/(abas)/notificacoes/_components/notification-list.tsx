import {
  BookOpen,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { HubNotification, NotificationKind } from "@/lib/data/notificacoes";
import { cn } from "@/lib/utils";

/** Ícone e cor (classe literal) de cada tipo de aviso, pela cor do pilar. */
const kindStyles: Record<NotificationKind, { icon: LucideIcon; toneClass: string }> = {
  resposta: { icon: MessageCircle, toneClass: "bg-comunidade" },
  seguidor: { icon: UserPlus, toneClass: "bg-comunidade" },
  curso: { icon: GraduationCap, toneClass: "bg-comunidade" },
  atividade: { icon: Target, toneClass: "bg-pratica" },
  licao: { icon: BookOpen, toneClass: "bg-trilha" },
  xp: { icon: Sparkles, toneClass: "bg-trilha" },
  nivel: { icon: Trophy, toneClass: "bg-trilha" },
};

type NotificationListProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  items: HubNotification[];
};

/** Um grupo de avisos (Hoje, Esta semana). Cada linha abre a tela do aviso. */
export function NotificationList({ id, title, icon, items }: NotificationListProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <SectionHeading id={id} title={title} icon={icon} tone="acao" />
      <SurfaceCard>
        <ul className="divide-y divide-linha">
          {items.map((item) => {
            const { icon: Icon, toneClass } = kindStyles[item.kind];

            return (
              <li key={item.id}>
                <Link href={item.href} className="flex gap-3 px-4 py-3">
                  <span
                    aria-hidden
                    className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", toneClass)}
                  >
                    <Icon className="size-5 text-texto" strokeWidth={1.75} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={cn("text-[15px] leading-snug", item.isUnread ? "font-bold" : "font-medium")}>
                      {item.title}
                    </span>
                    <span className="text-sm leading-snug text-texto-secundario">{item.body}</span>
                    <span className="text-xs text-texto-secundario">
                      {item.timeLabel}
                      {item.isUnread ? <span className="sr-only"> · não lida</span> : null}
                    </span>
                  </span>
                  {item.isUnread ? (
                    <span aria-hidden className="mt-1.5 size-2.5 shrink-0 rounded-full bg-acao ring-2 ring-acao/30" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </SurfaceCard>
    </section>
  );
}
