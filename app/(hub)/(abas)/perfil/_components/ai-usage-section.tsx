import { Gauge } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { SurfaceCard } from "@/components/surface-card";
import type { AiUsageData } from "../_data-access/get-ai-usage";
import { AiConnectCard } from "./ai-connect-card";
import { AiUsageCharts } from "./ai-usage-charts";
import { AiUsageTabs } from "./ai-usage-tabs";

type AiUsageSectionProps = {
  data: AiUsageData;
};

/** Uso das IAs de código conectadas (Claude, Codex, Copilot) — dados fictícios. */
export function AiUsageSection({ data }: AiUsageSectionProps) {
  const { tabs, selectedTab, disconnectedTools, sourceNames, usage } = data;
  const hasAnyConnected = tabs.some((tab) => tab.id !== "todas" && tab.isConnected);
  const selectedTool = disconnectedTools.find((tool) => tool.id === selectedTab);

  return (
    <section aria-labelledby="uso-das-ias" className="flex flex-col gap-2">
      <SectionHeading id="uso-das-ias" title="Uso das IAs" icon={Gauge} tone="comunidade" />
      <SurfaceCard className="flex flex-col gap-4 p-4">
        {hasAnyConnected ? (
          <>
            <AiUsageTabs tabs={tabs} selectedTab={selectedTab} />
            {usage ? (
              <AiUsageCharts usage={usage} sourceNames={sourceNames} />
            ) : selectedTool ? (
              <AiConnectCard
                title={`Conecte o ${selectedTool.name}`}
                description="Assim o uso dele aparece aqui, junto com as outras ferramentas."
                tools={[selectedTool]}
              />
            ) : null}
          </>
        ) : (
          <AiConnectCard
            title="Conecte suas IAs e acompanhe seu uso"
            description="Veja quantos tokens você gasta por dia e em que horários mais usa cada ferramenta."
            tools={disconnectedTools}
          />
        )}
      </SurfaceCard>
    </section>
  );
}
