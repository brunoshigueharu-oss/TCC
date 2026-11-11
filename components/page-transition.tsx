import { ViewTransition, type ReactNode } from "react";

/**
 * Transição discreta entre telas, com a View Transitions API (React
 * `<ViewTransition>`, ativo nas navegações do App Router). A tela antiga some
 * em ~110ms e a nova entra com fade e 6px de subida (`.pagina` em
 * `app/globals.css`). Usado nos `template.tsx` dos grupos de rota: o template
 * remonta a cada troca de tela, gerando o par saída/entrada, enquanto a casca
 * (barra lateral, barra inferior) fica parada. Atualizações na mesma tela
 * (filtros por `?param=`) não animam (`default="none"`). Navegadores sem
 * suporte trocam a tela sem animação.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="pagina" exit="pagina" default="none">
      <div className="flex w-full flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
