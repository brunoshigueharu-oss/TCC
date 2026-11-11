/** Arredonda o topo do eixo para um número limpo (1, 2, 2,5 ou 5 × 10ⁿ). */
export function niceAxisMax(max: number) {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= max) ?? 10;
  return step * magnitude;
}
