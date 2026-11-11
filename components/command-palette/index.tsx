import { buildCommandIndex } from "@/lib/command-index";
import { CommandPalette } from "./command-palette";

export { CommandPaletteTrigger } from "./command-palette-trigger";
export { openCommandPalette } from "./open-command-palette";

/**
 * Paleta de comandos com o índice do hub já montado. Server Component: lê os
 * dados em `lib/data` e entrega a lista pronta ao cliente. Montada uma vez na
 * casca do hub e das telas web.
 */
export function HubCommandPalette() {
  return <CommandPalette items={buildCommandIndex()} />;
}
