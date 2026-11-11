import type { ReactNode } from "react";

type SettingsGroupProps = {
  id: string;
  /** Número do grupo, em mono (ex.: "01"). */
  index: string;
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * Grupo de configurações: no computador, título e explicação numa coluna à
 * esquerda e as linhas à direita (padrão de páginas de ajustes editoriais);
 * no celular, empilhado. Sem cartão: só a linha de cima separa os grupos.
 */
export function SettingsGroup({ id, index, title, description, children }: SettingsGroupProps) {
  return (
    <section
      aria-labelledby={id}
      className="mx-4 grid gap-x-10 gap-y-2 border-t border-linha pt-5 lg:mx-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:pt-7"
    >
      <div className="flex flex-col gap-1.5">
        <h2 id={id} className="flex items-baseline gap-3 font-display text-xl font-medium tracking-[-0.02em]">
          <span className="font-mono text-xs font-normal tracking-normal text-texto-secundario tabular-nums">{index}</span>
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-texto-secundario">{description}</p>
      </div>
      <div className="flex flex-col divide-y divide-linha">{children}</div>
    </section>
  );
}
