import { FRAME_SECONDS } from "./constants";
import type { AsciiScene, Frame } from "./types";

/** Espera um evento do vídeo; desiste (rejeita) se a animação for desligada antes. */
function waitForVideo(video: HTMLVideoElement, event: "loadeddata" | "seeked", signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener(event, handleDone);
      video.removeEventListener("error", handleError);
      signal.removeEventListener("abort", handleAbort);
    };
    const handleDone = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("vídeo inválido"));
    };
    const handleAbort = () => {
      cleanup();
      reject(signal.reason);
    };
    if (signal.aborted) return handleAbort();
    video.addEventListener(event, handleDone);
    video.addEventListener("error", handleError);
    signal.addEventListener("abort", handleAbort);
  });
}

/** Guarda os quadros pulando o vídeo de 1/24 em 1/24 s (o arquivo vem inteiro como blob). */
export async function captureFrames(src: string, scene: AsciiScene, frames: Frame[], signal: AbortSignal) {
  const res = await fetch(src, { signal });
  if (!res.ok) throw new Error("vídeo não encontrado");
  const url = URL.createObjectURL(await res.blob());
  const video = document.createElement("video");
  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    const loaded = waitForVideo(video, "loadeddata", signal);
    video.src = url;
    await loaded;
    const height = Math.round((scene.frameWidth * video.videoHeight) / video.videoWidth);
    const end = Math.min(video.duration, scene.capture.to);
    for (let t = scene.capture.from; t < end; t += FRAME_SECONDS) {
      const seeked = waitForVideo(video, "seeked", signal);
      video.currentTime = t;
      await seeked;
      const bmp = await createImageBitmap(video, { resizeWidth: scene.frameWidth, resizeHeight: height, resizeQuality: "medium" });
      // desligado no meio da captura: a limpeza já rodou, então solta o quadro aqui
      if (signal.aborted) {
        bmp.close();
        return;
      }
      frames.push({ t, bmp });
    }
  } finally {
    // solta o vídeo e o blob mesmo se a captura parar no meio
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}
