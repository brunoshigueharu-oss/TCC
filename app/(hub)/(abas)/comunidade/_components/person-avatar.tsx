import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const sizeClasses: Record<AvatarSize, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-7 text-xs",
  md: "size-10 text-[15px]",
  lg: "size-16 text-2xl lg:size-20 lg:text-[28px]",
};

type PersonAvatarProps = {
  name: string;
  size?: AvatarSize;
  className?: string;
};

/**
 * Avatar provisório: monograma neutro (inicial do nome sobre cinza frio).
 * Sem cor por pessoa — na Comunidade a cor fica para o estado dos posts.
 */
export function PersonAvatar({
  name,
  size = "sm",
  className,
}: PersonAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-superficie-forte font-display font-medium text-texto",
        sizeClasses[size],
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
