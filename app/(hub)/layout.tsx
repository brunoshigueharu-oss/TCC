import { hubFontClasses } from "@/lib/fonts";

/**
 * Casca do hub. No celular (e em telas até `lg`) cada grupo mostra uma coluna
 * de celular centralizada; no computador cada grupo define sua largura:
 * - `(abas)`: barra lateral + conteúdo largo
 * - `(foco)`: coluna central mais larga, sem navegação
 * - `(entrada)`: coluna central estreita
 */
export default function HubLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-moldura font-texto text-texto lg:bg-superficie`}>
      {children}
    </div>
  );
}
