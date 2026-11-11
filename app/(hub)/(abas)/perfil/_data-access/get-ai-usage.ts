import "server-only";

import { aiToolIds, aiTools, type AiTool, type AiToolId, type AiUsage } from "@/lib/data/uso-ias";

/** Aba da seção: uma ferramenta ou a soma de todas as conectadas. */
export type AiUsageTab = "todas" | AiToolId;

export type AiUsageTabOption = {
  id: AiUsageTab;
  label: string;
  isConnected: boolean;
};

/** Uma ferramenta dentro do gráfico: tokens por dia e total da semana. */
export type AiUsageSeries = {
  id: AiToolId;
  name: string;
  tokensByDay: number[];
  totalTokens: number;
};

export type AiUsageData = {
  /** Séries somadas na aba escolhida, na ordem fixa das ferramentas. */
  series: AiUsageSeries[];
  tabs: AiUsageTabOption[];
  selectedTab: AiUsageTab;
  /** Ferramentas ainda sem conexão — viram botões "Conectar". */
  disconnectedTools: Pick<AiTool, "id" | "name">[];
  /** Nomes das ferramentas somadas no gráfico (ex.: "Claude e Codex"). */
  sourceNames: string[];
  /** `null` quando a aba escolhida não tem dados (ferramenta não conectada). */
  usage: AiUsage | null;
};

/** Lê o `?ia=` da URL; qualquer valor desconhecido volta para "todas". */
export function parseAiUsageTab(raw: string | undefined): AiUsageTab {
  return aiToolIds.find((id) => id === raw) ?? "todas";
}

/** Soma dia a dia e hora a hora o uso de várias ferramentas. */
function sumUsage(usages: AiUsage[]): AiUsage | null {
  const [first] = usages;
  if (!first) return null;

  return {
    week: first.week.map((day, index) => ({
      ...day,
      tokens: usages.reduce((sum, usage) => sum + (usage.week[index]?.tokens ?? 0), 0),
    })),
    previousWeekTokens: usages.reduce((sum, usage) => sum + usage.previousWeekTokens, 0),
    minutesByHour: first.minutesByHour.map((_, hour) =>
      usages.reduce((sum, usage) => sum + (usage.minutesByHour[hour] ?? 0), 0),
    ),
  };
}

/**
 * Busca o uso das IAs para a aba escolhida. No protótipo lê dados fictícios;
 * na versão real leria o que cada ferramenta conectada enviou.
 */
export async function getAiUsage(selectedTab: AiUsageTab): Promise<AiUsageData> {
  const connected = aiTools.filter((tool) => tool.usage !== null);
  const sources = selectedTab === "todas" ? connected : connected.filter((tool) => tool.id === selectedTab);

  return {
    tabs: [
      { id: "todas", label: "Todas", isConnected: connected.length > 0 },
      ...aiTools.map((tool) => ({ id: tool.id, label: tool.name, isConnected: tool.usage !== null })),
    ],
    selectedTab,
    disconnectedTools: aiTools.filter((tool) => tool.usage === null).map(({ id, name }) => ({ id, name })),
    sourceNames: sources.map((tool) => tool.name),
    series: sources.flatMap((tool) => {
      if (!tool.usage) return [];
      const tokensByDay = tool.usage.week.map((day) => day.tokens);
      return [{ id: tool.id, name: tool.name, tokensByDay, totalTokens: tokensByDay.reduce((sum, value) => sum + value, 0) }];
    }),
    usage: sumUsage(sources.flatMap((tool) => (tool.usage ? [tool.usage] : []))),
  };
}
