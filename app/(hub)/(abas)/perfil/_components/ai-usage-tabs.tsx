import Link from "next/link";

import { cn } from "@/lib/utils";
import type { AiUsageTab, AiUsageTabOption } from "../_data-access/get-ai-usage";

/** "todas" fica no endereço limpo; as outras abas vão em `?ia=`. */
function buildTabHref(tab: AiUsageTab) {
  return tab === "todas" ? "/perfil#uso-das-ias" : `/perfil?ia=${tab}#uso-das-ias`;
}

type AiUsageTabsProps = {
  tabs: AiUsageTabOption[];
  selectedTab: AiUsageTab;
};

/** Alternância Todas / Claude / Codex / Copilot com sublinhado; a aba fica na URL (`?ia=`). */
export function AiUsageTabs({ tabs, selectedTab }: AiUsageTabsProps) {
  return (
    <nav aria-label="Escolher ferramenta" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
      <ul className="flex gap-6 border-b border-linha">
        {tabs.map((tab) => {
          const isActive = tab.id === selectedTab;
          return (
            <li key={tab.id}>
              <Link
                href={buildTabHref(tab.id)}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-1.5 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:underline",
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-texto after:transition-transform after:duration-200",
                  isActive ? "text-texto after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  !isActive && tab.isConnected && "text-texto-secundario hover:text-texto",
                  !isActive && !tab.isConnected && "text-desativado hover:text-texto-secundario",
                )}
              >
                {tab.label}
                {tab.isConnected ? null : (
                  <span className="font-mono text-[10px] font-normal tracking-[0.04em] uppercase">
                    <span aria-hidden>· </span>não conectado
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
