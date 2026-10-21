import { BrandPanel } from "./_components/brand-panel";

/**
 * Entrada (cadastro, login, onboarding, nivelamento).
 * - Celular: coluna estreita centralizada (480px).
 * - Computador (`lg`): tela dividida — painel de marca à esquerda e a tela
 *   numa coluna de até 560px, centralizada vertical e horizontalmente à direita.
 */
export default function EntryLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-1 flex-col bg-superficie lg:max-w-none lg:flex-row">
      <BrandPanel />
      <div className="flex flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-[560px] lg:justify-center lg:py-12">
        {children}
      </div>
    </div>
  );
}
