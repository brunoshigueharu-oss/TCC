"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

/** O mesmo filme da prévia, mas parado: quem dá o tempo é este player (ver o comentário do HTML). */
const CONTROLLED_PLAYER = "/landing/manifesto/index.html?controlado";
/** Mix final da trilha (música do Ableton + efeitos), com os 38 s do filme. */
const SOUNDTRACK = "/landing/manifesto/trilha.m4a";
const DURATION_SECONDS = 38;

type FilmWindow = Window & { READY: true; renderOut: (seconds: number) => void };

/** O script do filme marca `READY` quando as fontes e imagens carregaram; antes disso não dá para desenhar. */
function isFilmReady(target: Window | null | undefined): target is FilmWindow {
  if (!target) return false;
  const film: Record<string, unknown> = Object(target);
  return film.READY === true && typeof film.renderOut === "function";
}

/** "0:07" a partir de segundos. */
function formatTime(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * Player do manifesto com som. Não existe arquivo de vídeo: a trilha toca num
 * `<audio>` e, a cada quadro, o filme é desenhado no tempo exato da música
 * (`renderOut(audio.currentTime)`), então imagem e som nunca se desencontram.
 * Começa a tocar ao abrir; clicar no filme pausa e retoma.
 */
export function FilmWatchPlayer() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Laço de desenho: só redesenha quando o tempo da trilha muda (pausado, fica parado).
  useEffect(() => {
    let frameId = 0;
    let renderedAt = -1;
    const draw = () => {
      const film = frameRef.current?.contentWindow;
      const audio = audioRef.current;
      if (audio && isFilmReady(film) && audio.currentTime !== renderedAt) {
        renderedAt = audio.currentTime;
        film.renderOut(Math.min(renderedAt, DURATION_SECONDS - 0.001));
        setCurrentTime(renderedAt);
      }
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Abriu pelo clique, então o navegador deixa tocar com som; se recusar, fica no play.
  useEffect(() => {
    const audio = audioRef.current;
    audio?.play().catch(() => setIsPlaying(false));
    return () => audio?.pause();
  }, []);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) return audio.pause();
    if (audio.ended) audio.currentTime = 0;
    audio.play().catch(() => setIsPlaying(false));
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(event.target.value);
    setHasEnded(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHasEnded(false);
  };
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const ToggleIcon = isPlaying ? Pause : hasEnded ? RotateCcw : Play;
  const toggleLabel = isPlaying ? "Pausar" : hasEnded ? "Assistir de novo" : "Tocar";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-linha bg-papel">
        <iframe
          ref={frameRef}
          src={CONTROLLED_PLAYER}
          title="Manifesto do BASE8: um motion design"
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 size-full border-0"
        />
        {/* O filme inteiro é a área de clique do play; pelo teclado, o botão abaixo faz o mesmo. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={handleTogglePlay}
          className="absolute inset-0 size-full cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={toggleLabel}
          onClick={handleTogglePlay}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-linha bg-fundo text-texto outline-none transition-[border-color,scale] duration-200 hover:border-texto focus-visible:ring-2 focus-visible:ring-texto active:scale-95"
        >
          <ToggleIcon aria-hidden className="size-5" strokeWidth={1.5} />
        </button>
        <input
          type="range"
          aria-label="Posição no filme"
          aria-valuetext={`${formatTime(currentTime)} de ${formatTime(DURATION_SECONDS)}`}
          min={0}
          max={DURATION_SECONDS}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className="h-11 min-w-0 flex-1 cursor-pointer accent-acao"
        />
        <p className="shrink-0 font-mono text-[13px] text-texto-secundario tabular-nums">
          {formatTime(currentTime)} / {formatTime(DURATION_SECONDS)}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={SOUNDTRACK}
        preload="auto"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />
    </div>
  );
}
