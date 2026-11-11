/**
 * Avisa a barra de carregamento do topo (`components/navigation-progress.tsx`)
 * que uma navegação do App Router começou. Navegar para a URL atual não conta.
 */
export function onRouterTransitionStart(url: string) {
  try {
    const target = new URL(url, window.location.href);
    const current = window.location;
    if (target.pathname === current.pathname && target.search === current.search) return;
    window.dispatchEvent(new Event("base8-navegacao-inicio"));
  } catch {
    // Instrumentação nunca pode quebrar a navegação.
  }
}
