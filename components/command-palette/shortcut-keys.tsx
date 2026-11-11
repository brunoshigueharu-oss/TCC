"use client";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useIsMac } from "@/hooks/use-is-mac";
import type { CommandShortcut } from "@/lib/command-index";
import { cn } from "@/lib/utils";

/** Como cada tecla especial aparece e como é lida. */
function describeKey(key: string, isMac: boolean) {
  if (key === "mod") return isMac ? { text: "⌘", spoken: "Command" } : { text: "Ctrl", spoken: "Control" };
  if (key === "alt") return isMac ? { text: "⌥", spoken: "Option" } : { text: "Alt", spoken: "Alt" };
  return { text: key, spoken: key };
}

type ShortcutKeysProps = {
  shortcut: CommandShortcut;
  className?: string;
};

/**
 * Atalho em teclas mono (⌘ K, G H). Sequências ("G depois H") ganham um
 * "então" discreto entre as teclas para não parecerem um acorde.
 */
export function ShortcutKeys({ shortcut, className }: ShortcutKeysProps) {
  const isMac = useIsMac();
  const keys = shortcut.keys.map((key) => describeKey(key, isMac));
  const spoken = keys.map((key) => key.spoken).join(shortcut.isSequence ? " depois " : " mais ");

  return (
    <KbdGroup className={cn("shrink-0", className)}>
      <span className="sr-only">Atalho: {spoken}</span>
      {keys.map((key, index) => (
        <span key={`${key.text}-${index}`} aria-hidden className="flex items-center gap-1">
          {shortcut.isSequence && index > 0 ? (
            <span className="font-mono text-[10px] text-desativado">›</span>
          ) : null}
          <Kbd>{key.text}</Kbd>
        </span>
      ))}
    </KbdGroup>
  );
}
