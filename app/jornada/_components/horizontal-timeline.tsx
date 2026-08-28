import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { Branch } from "@/lib/data/learning-journey";
import { BranchStation } from "./branch-station";
import { ScrollShell } from "./scroll-shell";

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
      className="relative min-h-[75vh] w-full border-y border-journey-line bg-journey-paper"
    >
      <ScrollShell aria-label="Linha do tempo horizontal da jornada com o Claude Code">
        <div className="grid w-max auto-cols-[340px] grid-flow-col grid-rows-[minmax(37.5vh,auto)_auto_minmax(37.5vh,auto)] px-16">
          {branches.map((branch, index) => (
            <Fragment key={branch.id}>
              <div className="flex items-end justify-center pb-3">
                {index % 2 === 0 ? <BranchStation branch={branch} /> : null}
              </div>
              <div className="relative flex items-center justify-center">
                <span className="h-px w-full bg-journey-line-strong" aria-hidden />
                <span
                  className={cn("absolute size-3 rounded-full", STATUS_DOT[branch.status])}
                  aria-hidden
                />
              </div>
              <div className="flex items-start justify-center pt-3">
                {index % 2 !== 0 ? <BranchStation branch={branch} /> : null}
              </div>
            </Fragment>
          ))}
        </div>
      </ScrollShell>
    </section>
  );
}
