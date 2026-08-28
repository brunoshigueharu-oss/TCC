import { cn } from "@/lib/utils";
import type { Branch, CommitKind } from "@/lib/data/learning-journey";

const STATUS_STYLES: Record<Branch["status"], { border: string; text: string; dot: string }> = {
  concluido: {
    border: "border-journey-line-strong",
    text: "text-journey-ink-soft",
    dot: "bg-journey-line-strong",
  },
  ativo: {
    border: "border-journey-accent",
    text: "text-journey-accent",
    dot: "bg-journey-accent",
  },
  insight: {
    border: "border-journey-warm",
    text: "text-journey-warm",
    dot: "bg-journey-warm",
  },
  "nao-iniciado": {
    border: "border-dashed border-journey-ink-soft",
    text: "text-journey-ink-soft",
    dot: "border-2 border-journey-ink-soft bg-journey-paper",
  },
};

function commitDotClass(branchStatus: Branch["status"], kind: CommitKind) {
  if (kind === "flag") return "bg-journey-flag";
  if (kind === "insight") return "bg-journey-warm";
  return STATUS_STYLES[branchStatus].dot;
}

export function BranchStation({ branch }: { branch: Branch }) {
  const styles = STATUS_STYLES[branch.status];

  return (
    <div
      className={cn(
        "flex w-[320px] flex-col gap-3 rounded-lg border bg-journey-surface p-5 shadow-sm sm:w-[360px]",
        styles.border,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="font-journey-mono text-base font-bold text-journey-ink">{branch.name}</span>
        {branch.metaHref ? (
          <a
            href={branch.metaHref}
            className={cn("font-journey-mono text-xs underline underline-offset-2", styles.text)}
          >
            {branch.meta}
          </a>
        ) : (
          <span className={cn("font-journey-mono text-xs", styles.text)}>{branch.meta}</span>
        )}
      </div>
      <p className="text-sm text-journey-ink-soft">{branch.intro}</p>
      {branch.commits.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {branch.commits.map((commit) => (
            <li key={commit.label} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  commitDotClass(branch.status, commit.kind),
                )}
              />
              <div className="flex flex-col gap-0.5">
                <span className="font-journey-mono text-xs font-bold text-journey-ink">
                  {commit.label}
                </span>
                <span className="text-sm text-journey-ink-soft">{commit.description}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {branch.openNote ? (
        <span className="w-fit rounded-full bg-journey-flag-soft px-2.5 py-1 font-journey-mono text-[0.68rem] tracking-wide text-journey-flag uppercase">
          {branch.openNote}
        </span>
      ) : null}
      {branch.reflection ? (
        <p className="border-l-2 border-journey-warm pl-3 text-sm text-journey-ink italic">
          {branch.reflection}
        </p>
      ) : null}
    </div>
  );
}
