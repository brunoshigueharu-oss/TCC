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
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h1 className="font-display text-[22px] leading-tight font-bold">{title}</h1>
        <p className="text-sm text-texto-secundario">{subtitle}</p>
      </div>
      <div className="flex w-[38%] shrink-0 justify-center rounded-l-[999px] bg-acao/15 py-3">
        <WelcomeShapes composition={composition} className="size-24" />
      </div>
    </SurfaceCard>
  );
}
