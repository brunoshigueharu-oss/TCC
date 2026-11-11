import { Plug } from "lucide-react";

import { brandButtonVariants } from "@/components/brand-button-variants";
import type { AiTool } from "@/lib/data/uso-ias";

type AiConnectCardProps = {
  title: string;
  description: string;
  tools: Pick<AiTool, "id" | "name">[];
};

/**
 * Convite para conectar ferramentas. No protótipo os botões são só visuais:
 * não existe conexão real com Claude, Codex ou Copilot.
 */
export function AiConnectCard({ title, description, tools }: AiConnectCardProps) {
  return (
    <div className="flex flex-col gap-4 border-y border-dashed border-linha py-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-[48ch] flex-col gap-1">
        <p className="font-display text-xl leading-tight font-medium tracking-[-0.02em]">{title}</p>
        <p className="text-sm text-texto-secundario">{description}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <li key={tool.id}>
            <button type="button" className={brandButtonVariants({ variant: "secondary", size: "sm" })}>
              <Plug aria-hidden strokeWidth={2} />
              Conectar {tool.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
