import { BottomNav } from "@/components/bottom-nav";

/** Telas que mostram a barra de navegação principal. */
export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomNav />
    </>
  );
}
