import { Plug } from "lucide-react";

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
    <div className="flex flex-col gap-4 rounded-xl bg-superficie p-4">
      <div className="flex flex-col gap-1">
        <p className="font-display text-base leading-tight font-bold">{title}</p>
        <p className="text-sm text-texto-secundario">{description}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {tools.map((tool) => (
          <li key={tool.id}>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-acao text-sm font-semibold text-texto hover:bg-acao/90"
            >
              <Plug aria-hidden className="size-4" strokeWidth={2} />
              Conectar {tool.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
