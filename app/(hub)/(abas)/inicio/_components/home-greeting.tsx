import { HomeBloom } from "./home-bloom";

type HomeGreetingProps = {
  firstName: string;
  weekday: string;
  dateLabel: string;
  /** Título da lição em andamento, quando existe. */
  lessonTitle: string | null;
};

/**
 * Abertura da Home, no espírito do herói da Landing: data em mono, saudação
 * grande em duas tintas (a segunda frase já diz o que vem hoje) e a flor de
 * caracteres ao lado, só onde sobra espaço.
 */
export function HomeGreeting({ firstName, weekday, dateLabel, lessonTitle }: HomeGreetingProps) {
  return (
    <header className="relative flex items-end justify-between gap-6 px-4 pt-8 pb-7 lg:px-0 lg:pt-4 lg:pb-10">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
        <p className="flex animate-fade-up items-center gap-2 text-xs font-semibold tracking-[0.08em] text-texto-secundario uppercase motion-reduce:animate-none">
          <span aria-hidden className="size-2 rounded-[2px] bg-acao" />
          {weekday}
          <span className="font-mono font-normal tracking-normal tabular-nums">{dateLabel}</span>
        </p>
        <h1 className="max-w-[18ch] animate-blur-in font-display text-[40px] leading-[1.02] font-medium tracking-[-0.045em] text-balance motion-reduce:animate-none sm:text-[48px] lg:text-[72px]">
          Olá, {firstName}.{" "}
          <span className="text-texto-secundario">
            {lessonTitle ? "Hoje você continua de onde parou." : "A trilha está em dia."}
          </span>
        </h1>
      </div>
      <HomeBloom className="pointer-events-none absolute top-2 right-0 size-28 animate-fade-up [animation-delay:300ms] motion-reduce:animate-none sm:size-36 lg:static lg:size-56 lg:shrink-0 xl:size-64" />
    </header>
  );
}
