/** Evento global que abre a paleta — dispensa contexto entre casca e telas. */
export const COMMAND_PALETTE_EVENT = "base8-paleta-abrir";

/** Abre a paleta de comandos de qualquer Client Component. */
export function openCommandPalette() {
  window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT));
}
