import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import type { HubNotification, NotificationKind } from "@/lib/data/notificacoes";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Pilar de cada tipo de aviso: rótulo curto e marcador de 8px (classe literal). */
const kindStyles: Record<NotificationKind, { label: string; marker: string }> = {
  resposta: { label: "Resposta", marker: "bg-comunidade" },
  seguidor: { label: "Pessoa", marker: "bg-comunidade" },
  curso: { label: "Minicurso", marker: "bg-comunidade" },
  atividade: { label: "Prática", marker: "bg-pratica" },
  licao: { label: "Trilha", marker: "bg-trilha" },
  xp: { label: "XP", marker: "bg-trilha" },
  nivel: { label: "Nível", marker: "bg-trilha" },
};

type NotificationListProps = {
  id: string;
  title: string;
  items: HubNotification[];
};

/** Um grupo de avisos (Hoje, Esta semana), em linhas. Cada linha abre a tela do aviso. */
export function NotificationList({ id, title, items }: NotificationListProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={id} className="flex flex-col">
      <SectionHeading id={id} title={title} tone="acao" meta={formatTwoDigits(items.length)} />
      <ul className="mx-4 divide-y divide-linha border-b border-linha lg:mx-0">
        {items.map((item) => {
          const { label, marker } = kindStyles[item.kind];

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-4 outline-none transition-colors hover:bg-superficie focus-visible:bg-superficie lg:-mx-3 lg:grid-cols-[120px_minmax(0,1fr)_auto] lg:rounded-lg lg:px-3"
              >
                <span className="col-start-1 row-start-1 flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-texto-secundario uppercase lg:items-start lg:pt-0.5">
                  <span aria-hidden className={cn("size-2 shrink-0 rounded-[2px] lg:mt-1", marker)} />
                  {label}
                </span>
                <span className="col-start-2 row-start-1 flex items-start justify-end gap-2 font-mono text-xs whitespace-nowrap text-texto-secundario tabular-nums lg:col-start-3">
                  {item.timeLabel}
                  {item.isUnread ? (
                    <span className="mt-1 size-2 rounded-full bg-acao">
                      <span className="sr-only">não lida</span>
                    </span>
                  ) : null}
                </span>
                <span className="col-span-2 flex min-w-0 flex-col gap-0.5 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                  <span className={cn("text-[15px] leading-snug", item.isUnread ? "font-semibold" : "font-medium text-texto-secundario")}>
                    {item.title}
                    <ArrowUpRight
                      aria-hidden
                      className="ml-1 inline size-3.5 align-[-2px] text-desativado opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      strokeWidth={2}
                    />
                  </span>
                  <span className="text-sm leading-snug text-texto-secundario">{item.body}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
