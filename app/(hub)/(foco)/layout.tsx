/**
 * Telas de foco (lição, prova, post, configurações...): sem navegação
 * principal. No computador a coluna alarga para 760px.
 */
export default function FocusLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-1 flex-col bg-superficie lg:max-w-[760px] lg:ring-1 lg:ring-linha/70">
      {children}
    </div>
  );
}
