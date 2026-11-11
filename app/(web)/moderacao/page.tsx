import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { formatTwoDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getModerationData, statusFilters } from "./_data-access/get-moderation-data";
import { ModerationSidebar } from "./_components/moderation-sidebar";
import { ReportDetail } from "./_components/report-detail";
import { ReportList } from "./_components/report-list";

export const metadata: Metadata = { title: "Moderação" };

function firstValue(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Moderação (web): mesa de trabalho do moderador. Menu à esquerda, fila de
 * denúncias com filtro (`?status=`) no centro e o item aberto (`?item=`) no
 * painel da direita, separados por linhas.
 */
export default async function ModerationPage({ searchParams }: PageProps<"/moderacao">) {
  const { status, item } = await searchParams;
  const { filter, counts, items, selected } = await getModerationData(firstValue(status), firstValue(item));

  return (
    <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(0,1fr)] px-4 lg:grid-cols-[200px_minmax(0,1fr)] lg:divide-x lg:divide-linha lg:px-10 xl:grid-cols-[200px_minmax(0,1fr)_380px]">
      <ModerationSidebar pendingCount={counts.pendentes} />

      <main aria-labelledby="moderacao-titulo" className="flex min-w-0 flex-col gap-6 py-6 lg:px-8 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase">
              <span aria-hidden className="size-2 rounded-[2px] bg-comunidade" />
              Moderação
            </p>
            <h1 id="moderacao-titulo" className="font-display text-[32px] leading-[1.02] font-medium tracking-[-0.04em] lg:text-[48px]">
              Denúncias
            </h1>
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-texto-secundario">
              Revise o conteúdo no contexto e registre uma decisão. Quem denunciou e quem publicou são avisados.
            </p>
          </div>
          <p className="flex flex-col items-end gap-1">
            <span className="font-display text-[56px] leading-none font-medium tracking-[-0.05em]">
              <AnimatedNumber value={counts.pendentes} format="dois-digitos" />
            </span>
            <span className="font-mono text-[11px] text-texto-secundario uppercase">pendentes</span>
          </p>
        </header>

        <nav aria-label="Filtrar por status" className="border-b border-linha">
          <ul className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {statusFilters.map(({ value, label }) => {
              const isActive = value === filter;
              return (
                <li key={value} className="shrink-0">
                  <Link
                    href={`/moderacao?status=${value}`}
                    scroll={false}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-2 border-b-2 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-texto",
                      isActive
                        ? "border-texto text-texto"
                        : "border-transparent text-texto-secundario hover:border-linha hover:text-texto",
                    )}
                  >
                    {label}
                    <span className="font-mono text-[11px] font-normal tabular-nums">{formatTwoDigits(counts[value])}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <ReportList items={items} filter={filter} selectedId={selected?.id ?? null} />
      </main>

      <div className="border-t border-linha py-6 lg:col-start-2 lg:px-8 xl:col-start-auto xl:border-t-0 xl:py-10">
        {selected ? <ReportDetail report={selected} /> : null}
      </div>
    </div>
  );
}
