import { z } from "zod";

/**
 * Uso FICTÍCIO das IAs de código da pessoa logada (seção "Uso das IAs" do
 * perfil). Não há conexão real com Claude, Codex ou Copilot: os números só
 * mostram como a tela ficaria depois de a pessoa conectar as ferramentas.
 */

export const aiToolIds = ["claude", "codex", "copilot"] as const;

const usageDaySchema = z.object({
  label: z.string(),
  tokens: z.number().int().nonnegative(),
  /** Dia que ainda não chegou — aparece apagado no gráfico. */
  isFuture: z.boolean(),
});

const usageSchema = z.object({
  week: z.array(usageDaySchema).length(7),
  previousWeekTokens: z.number().int().nonnegative(),
  /** Minutos de uso em cada hora do dia (0h a 23h), somando a semana. */
  minutesByHour: z.array(z.number().int().nonnegative()).length(24),
});

const aiToolSchema = z.object({
  id: z.enum(aiToolIds),
  name: z.string(),
  /** `null` quando a ferramenta ainda não foi conectada. */
  usage: usageSchema.nullable(),
});

export type AiToolId = (typeof aiToolIds)[number];
export type AiUsageDay = z.infer<typeof usageDaySchema>;
export type AiUsage = z.infer<typeof usageSchema>;
export type AiTool = z.infer<typeof aiToolSchema>;

const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
/** Mesma semana de "Sua semana": sábado e domingo ainda não chegaram. */
const FIRST_FUTURE_DAY = 5;

function buildWeek(tokens: number[]) {
  return dayLabels.map((label, index) => ({
    label,
    tokens: tokens[index] ?? 0,
    isFuture: index >= FIRST_FUTURE_DAY,
  }));
}

export const aiTools: AiTool[] = z.array(aiToolSchema).parse([
  {
    id: "claude",
    name: "Claude",
    usage: {
      week: buildWeek([260_000, 340_000, 120_000, 380_000, 100_000, 0, 0]),
      previousWeekTokens: 1_070_000,
      // Mais uso à noite, depois do trabalho.
      minutesByHour: [10, 0, 0, 0, 0, 0, 0, 0, 5, 15, 20, 15, 5, 10, 15, 20, 15, 10, 25, 50, 70, 90, 60, 30],
    },
  },
  {
    id: "codex",
    name: "Codex",
    usage: {
      week: buildWeek([90_000, 150_000, 60_000, 210_000, 100_000, 0, 0]),
      previousWeekTokens: 680_000,
      // Mais uso à tarde, em horário de trabalho.
      minutesByHour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 25, 30, 10, 20, 40, 45, 35, 20, 5, 0, 5, 10, 5, 0],
    },
  },
  { id: "copilot", name: "Copilot", usage: null },
]);
