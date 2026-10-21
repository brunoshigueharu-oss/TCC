/**
 * Topo das telas de entrada: logo provisório (círculo cinza) + nome do hub.
 * Sai quando o logo definitivo estiver vetorizado.
 */
export function BrandHeader() {
  return (
    <header className="flex h-14 items-center gap-2 px-4">
      <span aria-hidden className="size-[26px] rounded-full bg-superficie-forte" />
      <span className="font-display text-[15px] font-bold">código &amp; design</span>
    </header>
  );
}
