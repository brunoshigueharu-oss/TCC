import Image from "next/image";

import { cn } from "@/lib/utils";
import { BallSpin } from "./map-reveal";

/** A bola 8 colorida da identidade visual (logo simplificada). */
const BALL = { src: "/landing/manifesto/assets/idv/bola8.png", size: 1024 } as const;

type Base8LogoProps = {
  className?: string;
  /** A bola rola até o lugar quando a logo entra na tela (mapa da solução). */
  hasBallSpin?: boolean;
};

/**
 * Logo BASE8 da marca: "BASE" em Instrument Sans e a bola 8 colorida no lugar
 * do 8. Proporções da logo oficial: a bola tem 9/7 da altura das maiúsculas,
 * com um respiro de 1,5/7 antes dela. O tamanho acompanha a largura da caixa.
 */
export function Base8Logo({ className, hasBallSpin = false }: Base8LogoProps) {
  const ball = (
    <Image
      src={BALL.src}
      alt=""
      width={BALL.size}
      height={BALL.size}
      sizes="(min-width: 1024px) 200px, 120px"
      draggable={false}
      className="ml-[0.15em] size-[0.9em] -translate-y-[0.03em]"
    />
  );

  return (
    <div className={cn("@container", className)}>
      <p
        aria-label="BASE8"
        className="flex items-center justify-center font-display text-[26cqw] leading-none font-semibold tracking-[-0.02em] select-none"
      >
        <span aria-hidden>BASE</span>
        {hasBallSpin ? <BallSpin>{ball}</BallSpin> : ball}
      </p>
    </div>
  );
}
