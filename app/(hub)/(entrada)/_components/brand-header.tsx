import { BrandMark } from "@/components/brand-mark";

/** Topo das telas de entrada no celular: o mesmo logo da Landing. */
export function BrandHeader() {
  return (
    <header className="flex h-14 items-center px-4 lg:hidden">
      <BrandMark href="/" />
    </header>
  );
}
