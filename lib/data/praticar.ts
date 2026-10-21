import { z } from "zod";

/**
 * Dados FICTÍCIOS da área Praticar para o protótipo. Na versão real as
 * atividades vêm da API e a avaliação é feita pela IA a partir da resposta
 * enviada; aqui cada atividade já traz uma avaliação de exemplo.
 */

const activityKindSchema = z.enum(["prompt", "revisao-de-codigo", "projeto-curto"]);
const activityLevelSchema = z.enum(["Iniciante", "Intermediário", "Avançado"]);
const criterionResultSchema = z.enum(["atendido", "parcial", "nao-atendido"]);

const activitySchema = z.object({
  id: z.string(),
  kind: activityKindSchema,
  level: activityLevelSchema,
  title: z.string(),
  /** Título curto, usado no topo da atividade e do resultado. */
  shortTitle: z.string(),
  minutes: z.number().int().positive(),
  xpReward: z.number().int().positive(),
  statement: z.string(),
  /** Trecho de código gerado pela IA, nas atividades de revisão. */
  codeSample: z.string().optional(),
  criteria: z.array(z.string()).min(1),
  sampleEvaluation: z.object({
    results: z.array(criterionResultSchema).min(1),
    comment: z.string(),
  }),
});

const practiceSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  activities: z.array(activitySchema).min(1),
});

export type ActivityKind = z.infer<typeof activityKindSchema>;
export type CriterionResult = z.infer<typeof criterionResultSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type Practice = z.infer<typeof practiceSchema>;

export const activityKindLabel: Record<ActivityKind, string> = {
  prompt: "Prompt",
  "revisao-de-codigo": "Revisão de código",
  "projeto-curto": "Projeto curto",
};

export const activityKinds = activityKindSchema.options;

export const practice: Practice = practiceSchema.parse({
  title: "Praticar",
  subtitle: "Atividades curtas, avaliadas na hora",
  activities: [
    {
      id: "card-responsivo",
      kind: "prompt",
      level: "Iniciante",
      title: "Reescreva um prompt vago para gerar um card de curso",
      shortTitle: "Reescreva um prompt vago",
      minutes: 10,
      xpReward: 30,
      statement:
        "O prompt “faz um card bonito” gerou um resultado genérico. Reescreva-o para gerar um card de curso com título, duração e botão, em 390 px de largura.",
      criteria: [
        "Objetivo claro do componente",
        "Restrições explícitas (tamanho, conteúdo)",
        "Formato da resposta definido",
      ],
      sampleEvaluation: {
        results: ["atendido", "atendido", "parcial"],
        comment:
          "Bom recorte do objetivo e das medidas. Falta dizer em que formato você quer a resposta, por exemplo “devolva só o código do componente”.",
      },
    },
    {
      id: "estado-de-erro",
      kind: "revisao-de-codigo",
      level: "Intermediário",
      title: "Encontre três problemas de acessibilidade no estado de erro de um campo",
      shortTitle: "Revise o estado de erro",
      minutes: 15,
      xpReward: 50,
      statement:
        "A IA gerou o campo de e-mail abaixo com estado de erro. Aponte três problemas de acessibilidade e escreva o prompt que você usaria para pedir a correção.",
      codeSample:
        '<label>E-mail</label>\n<input class="border-red" />\n<span style="color:red">Inválido</span>',
      criteria: [
        "Identifica o rótulo sem ligação com o campo",
        "Aponta o erro comunicado só pela cor",
        "Pede a correção com instruções verificáveis",
      ],
      sampleEvaluation: {
        results: ["atendido", "parcial", "atendido"],
        comment:
          "Você encontrou o rótulo solto e pediu a correção com clareza. Sobre a cor: além de citar o vermelho, peça um ícone ou texto que explique o erro.",
      },
    },
    {
      id: "ajustar-espacamento",
      kind: "projeto-curto",
      level: "Avançado",
      title: "Gere e ajuste o espaçamento de uma tela de login responsiva",
      shortTitle: "Ajuste o espaçamento do login",
      minutes: 40,
      xpReward: 120,
      statement:
        "Peça à IA uma tela de login para celular e computador. Depois, ajuste o espaçamento para uma escala de 8 px. Cole o prompt final e o link do resultado.",
      criteria: [
        "Pede a tela com conteúdo e larguras definidos",
        "Usa uma escala de espaçamento explícita",
        "Ajusta o resultado em pedidos curtos e separados",
      ],
      sampleEvaluation: {
        results: ["atendido", "atendido", "atendido"],
        comment:
          "Escala de 8 px aplicada do início ao fim e ajustes pedidos um de cada vez. Para a próxima, compare as duas larguras lado a lado antes de concluir.",
      },
    },
  ],
});

export function findActivity(source: Practice, activityId: string) {
  return source.activities.find((activity) => activity.id === activityId) ?? null;
}

/** Próxima atividade da lista (volta para a primeira no fim). */
export function findNextActivity(source: Practice, activityId: string) {
  const index = source.activities.findIndex((activity) => activity.id === activityId);
  return source.activities[(index + 1) % source.activities.length];
}

/** Resumo da avaliação. No protótipo, enviar a atividade já garante o XP inteiro. */
export function getEvaluationSummary(activity: Activity) {
  const { results } = activity.sampleEvaluation;
  return {
    met: results.filter((result) => result === "atendido").length,
    total: results.length,
    xpEarned: activity.xpReward,
  };
}

/** Resposta enviada numa atividade. Validada no formulário e na Server Action. */
export const activityAnswerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(20, "Escreva pelo menos 20 caracteres para a IA conseguir avaliar.")
    .max(4000, "Resposta longa demais. Use no máximo 4.000 caracteres."),
  link: z.union([
    z.literal(""),
    z.url({ protocol: /^https?$/, message: "Cole o link completo, começando com https://" }),
  ]),
});

export type ActivityAnswer = z.infer<typeof activityAnswerSchema>;
