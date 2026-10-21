import { hubFontClasses } from "@/lib/fonts";

/**
 * Casca do hub. Por enquanto o protótipo é mobile-first: no computador a tela
 * aparece como uma coluna de celular centralizada. O fundo das telas é
 * `superficie` (cinza-claro) e os blocos ficam em cartões brancos, como na Home.
 */
export default function HubLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${hubFontClasses} min-h-dvh bg-moldura font-texto text-texto`}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-superficie">
        {children}
      </div>
    </div>
  );
}
