const numberFormatter = new Intl.NumberFormat("pt-BR");

/** 1240 → "1.240" */
export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

/** 3 → "03" */
export function formatTwoDigits(value: number) {
  return String(value).padStart(2, "0");
}

/** 0 → "sem resposta", 1 → "1 resposta", 3 → "3 respostas" */
export function formatAnswers(count: number) {
  if (count === 0) return "sem resposta";
  return count === 1 ? "1 resposta" : `${count} respostas`;
}

const compactFormatter = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

/** 1_200_000 → "1,2 mi", 610_000 → "610 mil" */
export function formatCompact(value: number) {
  return compactFormatter.format(value);
}
