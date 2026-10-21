import type { AvatarTone } from "@/lib/data/pessoas";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "lg";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const toneClasses: Record<AvatarTone, string> = {
  noite: "bg-texto text-trilha",
  trilha: "bg-trilha text-texto",
  pratica: "bg-pratica text-texto",
  comunidade: "bg-comunidade text-texto",
  acao: "bg-acao text-texto",
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-10 text-base",
  lg: "size-16 border-[3px] border-fundo text-2xl",
};

type PersonAvatarProps = {
  name: string;
  tone: AvatarTone;
  size?: AvatarSize;
};

/** Avatar provisório: inicial do nome num círculo, como na Home. */
export function PersonAvatar({ name, tone, size = "sm" }: PersonAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-bold",
        toneClasses[tone],
        sizeClasses[size],
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
