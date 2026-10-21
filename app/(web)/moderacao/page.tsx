import type { Metadata } from "next";

import { Chip } from "@/components/chip";
import { getModerationData, statusFilters } from "./_data-access/get-moderation-data";
import { ModerationSidebar } from "./_components/moderation-sidebar";
import { ReportDetail } from "./_components/report-detail";
import { ReportList } from "./_components/report-list";

export const metadata: Metadata = { title: "Moderação" };

function firstValue(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Moderação (web, Figma 61:56): fila de denúncias com filtro (`?status=`) e o
 * item aberto no painel lateral (`?item=`).
 */
export default async function ModerationPage({ searchParams }: PageProps<"/moderacao">) {
  const { status, item } = await searchParams;
  const { filter, counts, items, selected } = await getModerationData(
    firstValue(status),
    firstValue(item),
  );

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[minmax(0,1fr)] gap-6 px-4 pt-6 pb-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-8 lg:px-10 lg:pt-8 xl:grid-cols-[200px_minmax(0,1fr)_340px]">
      <ModerationSidebar pendingCount={counts.pendentes} />

      <main aria-labelledby="moderacao-titulo" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-texto">
            Moderação
          </span>
          <h1 id="moderacao-titulo" className="mt-1 font-display text-[28px] leading-tight font-bold">
            Denúncias
          </h1>
          <p className="text-sm text-texto-secundario">
            {counts.pendentes} pendentes · revise o conteúdo e registre uma decisão.
          </p>
        </div>

        <nav aria-label="Filtrar por status">
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {statusFilters.map(({ value, label }) => (
              <li key={value}>
                <Chip href={`/moderacao?status=${value}`} isActive={value === filter} scroll={false}>
                  {label} ({counts[value]})
                </Chip>
              </li>
            ))}
          </ul>
        </nav>

        <ReportList items={items} filter={filter} selectedId={selected?.id ?? null} />
      </main>

      <div className="lg:col-start-2 xl:col-start-auto">
        {selected ? <ReportDetail report={selected} /> : null}
      </div>
    </div>
  );
}
