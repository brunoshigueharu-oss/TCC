import { BUCKETS } from "./constants";

/**
 * Prepara a busca do ponto mais próximo (pontos em 0–1) com uma grade de
 * baldes: procura em anéis crescentes em volta do balde do ponto, em vez de
 * comparar com todos (o quadro em que a troca começa não engasga).
 */
export function buildNearest(points: (readonly [number, number])[]) {
  const bucketOf = (v: number) => Math.min(BUCKETS - 1, Math.max(0, Math.floor(v * BUCKETS)));
  const buckets: number[][] = Array.from({ length: BUCKETS * BUCKETS }, () => []);
  points.forEach(([x, y], k) => buckets[bucketOf(y) * BUCKETS + bucketOf(x)].push(k));
  return ([px, py]: readonly [number, number]) => {
    const bx = bucketOf(px);
    const by = bucketOf(py);
    let best = 0;
    let bestDist2 = Infinity;
    for (let ring = 0; ring < BUCKETS; ring++) {
      // nada mais perto fora deste anel: para
      const reach = (ring - 1) / BUCKETS;
      if (ring > 0 && reach > 0 && reach * reach > bestDist2) break;
      for (let y = by - ring; y <= by + ring; y++) {
        if (y < 0 || y >= BUCKETS) continue;
        for (let x = bx - ring; x <= bx + ring; x++) {
          if (x < 0 || x >= BUCKETS) continue;
          // só a borda do anel (o miolo já foi visto)
          if (ring > 0 && y !== by - ring && y !== by + ring && x !== bx - ring && x !== bx + ring) continue;
          for (const k of buckets[y * BUCKETS + x]) {
            const dx = points[k][0] - px;
            const dy = points[k][1] - py;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < bestDist2) {
              bestDist2 = dist2;
              best = k;
            }
          }
        }
      }
    }
    return best;
  };
}
