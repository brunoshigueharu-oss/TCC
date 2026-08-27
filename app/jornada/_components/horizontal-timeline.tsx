import { cn } from "@/lib/utils";
import type { Branch } from "@/lib/data/learning-journey";
import { BranchStation } from "./branch-station";

const STATUS_DOT: Record<Branch["status"], string> = {
  concluido: "bg-journey-line-strong",
  ativo: "bg-journey-accent",
  insight: "bg-journey-warm",
  "nao-iniciado": "border-2 border-journey-ink-soft bg-journey-paper",
};

export function HorizontalTimeline({ branches }: { branches: Branch[] }) {
  return (
    <section
      aria-label="Linha do tempo horizontal da jornada com o Claude Code"
      className="relative h-[75vh] w-full overflow-x-auto overflow-y-hidden border-y border-journey-line bg-journey-paper"
    >
      <div className="relative flex h-full w-max items-stretch px-16">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-journey-line-strong" />
        {branches.map((branch, index) => (
          <div key={branch.id} className="flex h-full w-[340px] shrink-0 flex-col items-center">
            <div className="flex flex-1 items-end justify-center pb-3">
              {index % 2 === 0 ? <BranchStation branch={branch} /> : null}
            </div>
            <div className="relative flex w-full items-center justify-center">
              <span className="h-4 w-px bg-journey-line-strong" aria-hidden />
              <span
                className={cn("absolute size-3 rounded-full", STATUS_DOT[branch.status])}
                aria-hidden
              />
            </div>
            <div className="flex flex-1 items-start justify-center pt-3">
              {index % 2 !== 0 ? <BranchStation branch={branch} /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
