import { z } from "zod";

export const reportReasons = [
  { value: "spam", label: "Spam ou divulgação" },
  { value: "ofensivo", label: "Conteúdo ofensivo ou assédio" },
  { value: "incorreto", label: "Informação incorreta ou enganosa" },
  { value: "fora-do-tema", label: "Fora do tema da comunidade" },
] as const;

const reasonValues = ["spam", "ofensivo", "incorreto", "fora-do-tema"] as const;

/** Denúncia de post — compartilhado entre o formulário e a Server Action. */
export const reportSchema = z.object({
  postId: z.string().min(1),
  // O formulário começa sem motivo (""); a saída validada é sempre um motivo.
  reason: z
    .union([z.literal(""), z.enum(reasonValues)])
    .pipe(z.enum(reasonValues, { error: "Escolha um motivo." })),
  details: z.string().trim().max(500, { error: "Use no máximo 500 caracteres." }),
});

export type ReportFormValues = z.input<typeof reportSchema>;
export type ReportInput = z.output<typeof reportSchema>;
export type ReportReason = ReportInput["reason"];
