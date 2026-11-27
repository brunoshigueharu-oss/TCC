/** Contas numéricas pequenas usadas pela landing, pelo 3D e pelas animações. */

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

export function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const amount = clamp((value - edgeStart) / (edgeEnd - edgeStart), 0, 1);
  return amount * amount * (3 - 2 * amount);
}
