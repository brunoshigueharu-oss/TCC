import { BrandMark } from "./brand-mark";

type LandingFooterProps = {
  links: string[];
};

/** Rodapé da Landing. Os links institucionais ainda não têm página. */
export function LandingFooter({ links }: LandingFooterProps) {
  return (
    <footer className="bg-fundo ring-1 ring-linha/70">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-3 px-4 py-6 text-sm sm:flex-row sm:justify-between lg:px-10">
        <BrandMark href="/" />
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-medium">
          {links.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        <p className="text-xs text-texto-secundario">© 2026</p>
      </div>
    </footer>
  );
}
