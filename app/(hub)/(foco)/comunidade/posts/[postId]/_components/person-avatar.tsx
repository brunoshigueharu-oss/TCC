import { cn } from "@/lib/utils";

// Classes literais: o Tailwind não enxerga nomes montados dinamicamente.
const avatarColors = ["bg-pratica", "bg-trilha", "bg-comunidade", "bg-acao"] as const;

/** Cor estável por pessoa, a partir do nome de usuário. */
function pickAvatarColor(username: string) {
  const sum = [...username].reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
}

type PersonAvatarProps = {
  username: string;
  name: string;
  className?: string;
};

/** Avatar provisório: círculo na cor de um pilar com a inicial da pessoa. */
export function PersonAvatar({ username, name, className }: PersonAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-texto",
        pickAvatarColor(username),
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
