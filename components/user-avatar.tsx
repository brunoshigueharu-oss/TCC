import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  className?: string;
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Avatar tipográfico: iniciais em mono num círculo de linha fina. Decorativo —
 * o nome da pessoa aparece ao lado (ou no `aria-label` de quem usa).
 */
export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border border-linha bg-superficie font-mono text-[11px] font-medium tracking-wide text-texto",
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
