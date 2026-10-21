const TIME_ZONE = "America/Sao_Paulo";

const shortDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: TIME_ZONE,
});

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

/** "2026-10-18T14:32…" → "18/10" */
export function formatShortDate(iso: string) {
  return shortDate.format(new Date(iso));
}

/** "2026-10-18T14:32…" → "18/10/2026, 14:32" */
export function formatFullDate(iso: string) {
  return fullDate.format(new Date(iso));
}
