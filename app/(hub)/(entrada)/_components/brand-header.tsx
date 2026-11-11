import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

/** Topo das telas de entrada no celular: o logo da Landing e o tema. */
export function BrandHeader() {
  return (
    <header className="flex h-14 items-center justify-between px-4 lg:hidden">
      <BrandMark href="/" />
      <ThemeToggle />
    </header>
  );
}
