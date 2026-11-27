import type { Frame, Grid, Layer, Pose } from "./types";

function fadeEdges(cx: CanvasRenderingContext2D, background: string, dw: number, dh: number, amount: number) {
  const ex = dw * amount;
  const ey = dh * amount;
  const fades: [number, number, number, number, number, number, number, number][] = [
    [0, 0, ex, 0, 0, 0, ex, dh],
    [dw, 0, dw - ex, 0, dw - ex, 0, ex, dh],
    [0, 0, 0, ey, 0, 0, dw, ey],
    [0, dh, 0, dh - ey, 0, dh - ey, dw, ey],
  ];
  for (const [x0, y0, x1, y1, rx, ry, rw, rh] of fades) {
    const grad = cx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, background);
    grad.addColorStop(1, "transparent");
    cx.fillStyle = grad;
    cx.fillRect(rx, ry, rw, rh);
  }
}

/** Desenha o vídeo na grade pequena, girado em volta do pé do quadro e misturando quadros vizinhos. */
export function sampleLayer(layer: Layer, g: Grid, pose: Pose) {
  const { frames, scene } = layer;
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (frames[mid].t <= pose.t) lo = mid;
    else hi = mid - 1;
  }
  const a = frames[lo];
  let b: Frame | undefined = frames[lo + 1];
  let bt = b?.t ?? 0;
  // loop: depois do último quadro vem o primeiro, misturado como os outros (sem travadinha)
  if (!b && layer.isCaptured && scene.loopEnd !== undefined) {
    b = frames[0];
    bt = scene.loopEnd;
  }
  const [sx, sy, sw, sh] = g.src;
  const [dx, dy, dw, dh] = g.dst;
  const cx = g.cx;
  cx.setTransform(1, 0, 0, 1, 0, 0);
  cx.globalAlpha = 1;
  cx.fillStyle = scene.background;
  cx.fillRect(0, 0, g.cols, g.rows);
  cx.translate(dx + dw / 2, dy + dh);
  cx.rotate(pose.rot);
  cx.translate(-dw / 2, -dh);
  cx.drawImage(a.bmp, sx, sy, sw, sh, 0, 0, dw, dh);
  if (b && pose.t > a.t && bt > a.t) {
    cx.globalAlpha = Math.min(1, (pose.t - a.t) / (bt - a.t));
    cx.drawImage(b.bmp, sx, sy, sw, sh, 0, 0, dw, dh);
    cx.globalAlpha = 1;
  }
  if (scene.edgeFade) fadeEdges(cx, scene.background, dw, dh, scene.edgeFade);
  cx.setTransform(1, 0, 0, 1, 0, 0);
  return cx.getImageData(0, 0, g.cols, g.rows).data;
}
