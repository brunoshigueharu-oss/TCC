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
