/**
 * Lê uma posição 1-based da URL (`?passo=N`, `?pergunta=N`) e a mantém entre
 * 1 e o total. Valor ausente ou inválido volta para 1.
 */
export function parsePosition(raw: string | string[] | undefined, total: number) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, total);
}
