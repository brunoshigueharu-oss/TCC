import Link from "next/link";

import { cn } from "@/lib/utils";
import type { AiUsageTab, AiUsageTabOption } from "../_data-access/get-ai-usage";

/** "todas" fica no endereço limpo; as outras abas vão em `?ia=`. */
function buildTabHref(tab: AiUsageTab) {
  return tab === "todas" ? "/perfil" : `/perfil?ia=${tab}`;
}

type AiUsageTabsProps = {
  tabs: AiUsageTabOption[];
  selectedTab: AiUsageTab;
};

/** Alternância Todas / Claude / Codex / Copilot; a aba fica na URL (`?ia=`). */
export function AiUsageTabs({ tabs, selectedTab }: AiUsageTabsProps) {
  return (
    <nav aria-label="Escolher ferramenta">
      <ul className="grid grid-cols-4 gap-1 rounded-2xl bg-superficie p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === selectedTab;
          return (
            <li key={tab.id}>
              <Link
                href={buildTabHref(tab.id)}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                  isActive && "bg-texto text-fundo",
                  !isActive && tab.isConnected && "text-texto-secundario hover:text-texto",
                  !isActive && !tab.isConnected && "text-desativado hover:text-texto-secundario",
                )}
              >
                {tab.label}
                {tab.isConnected ? null : <span className="sr-only"> (não conectado)</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
