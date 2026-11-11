import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function readIsMac() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

/** `true` em macOS/iOS, para mostrar ⌘ em vez de Ctrl. No servidor assume que não. */
export function useIsMac() {
  return useSyncExternalStore(subscribe, readIsMac, () => false);
}
