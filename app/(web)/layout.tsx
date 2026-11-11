import { HubCommandPalette } from "@/components/command-palette";
import { hubFontClasses } from "@/lib/fonts";
import { WebTopBar } from "./_components/web-top-bar";

/**
 * Casca das telas pensadas para computador (Criar minicurso, Moderação):
 * largura total, fundo branco, barra superior com busca (⌘K) e tema.
 */
export default function WebLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${hubFontClasses} flex min-h-dvh flex-col bg-fundo font-texto text-texto`}>
      <WebTopBar />
      {children}
      <HubCommandPalette />
    </div>
  );
}
