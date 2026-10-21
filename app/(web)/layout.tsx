import { hubFontClasses } from "@/lib/fonts";
import { WebTopBar } from "./_components/web-top-bar";

/**
 * Casca das telas pensadas para computador (Criar minicurso, Moderação):
 * largura total, fora da coluna de celular do hub.
 */
export default function WebLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${hubFontClasses} min-h-dvh bg-superficie font-texto text-texto`}>
      <WebTopBar />
      {children}
    </div>
  );
}
