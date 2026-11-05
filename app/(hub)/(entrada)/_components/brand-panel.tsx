import { BrandMark } from "@/components/brand-mark";
import { WelcomeShapes } from "./welcome-shapes";

/**
 * Painel de marca das telas de entrada no computador (`lg`): metade esquerda
 * da tela dividida, com o logo no topo e a ilustração provisória ao centro.
 * Fica oculto no celular, onde o `BrandHeader` faz esse papel.
 */
export function BrandPanel() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[44%] shrink-0 flex-col justify-between overflow-hidden bg-acao/15 p-10 lg:flex xl:w-1/2">
      <BrandMark href="/" />
      <div className="flex flex-1 items-center justify-center">
        <div className="relative aspect-square w-[min(28rem,70%)]">
          <WelcomeShapes composition="entrar" className="absolute inset-0 size-full" />
          <WelcomeShapes
            composition="cadastro"
            className="absolute -right-1/4 -bottom-1/4 size-1/2 opacity-80"
          />
        </div>
      </div>
      <span aria-hidden className="h-11" />
    </aside>
  );
}
