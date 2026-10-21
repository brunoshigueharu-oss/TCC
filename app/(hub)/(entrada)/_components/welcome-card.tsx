import { SurfaceCard } from "@/components/surface-card";
import { WelcomeShapes, type WelcomeComposition } from "./welcome-shapes";

type WelcomeCardProps = {
  title: string;
  subtitle: string;
  composition: WelcomeComposition;
};

/**
 * Cartão de boas-vindas (Login e Cadastro): título da tela à esquerda e a
 * meia-lua com a ilustração provisória à direita, como os cartões da Home.
 */
export function WelcomeCard({ title, subtitle, composition }: WelcomeCardProps) {
  return (
    <SurfaceCard className="flex items-center">
      <div className="flex flex-1 flex-col gap-1 p-4 lg:gap-1.5 lg:p-6">
        <h1 className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">{title}</h1>
        <p className="text-sm text-texto-secundario">{subtitle}</p>
      </div>
      <div className="flex w-[38%] shrink-0 justify-center rounded-l-[999px] bg-acao/15 py-3">
        <WelcomeShapes composition={composition} className="size-24 lg:size-28" />
      </div>
    </SurfaceCard>
  );
}
