import { BrandPanel } from "./_components/brand-panel";

/**
 * Entrada (cadastro, login, onboarding, consentimento, nivelamento).
 * - Celular: coluna única sobre fundo branco, com o logo no topo.
 * - Computador (`lg`): tela dividida — painel de ASCII art à esquerda e a tela
 *   numa coluna de até 460px, centralizada à direita.
 */
export default function EntryLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-fundo lg:flex-row">
      <BrandPanel />
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col lg:max-w-[460px] lg:justify-center lg:py-16">
        {children}
      </div>
    </div>
  );
}
