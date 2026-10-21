import { z } from "zod";

/**
 * Dados FICTÍCIOS dos avisos da Marina para o protótipo. Na versão real vêm
 * do módulo de notificações da API. Os 4 não lidos batem com o selo da Home.
 */

const notificationSchema = z.object({
  id: z.string(),
  /** Define o ícone e a cor do pilar. */
  kind: z.enum(["resposta", "atividade", "xp", "licao", "curso", "nivel", "seguidor"]),
  title: z.string(),
  body: z.string(),
  /** Tempo relativo, já escrito para exibição. */
  timeLabel: z.string(),
  period: z.enum(["hoje", "semana"]),
  isUnread: z.boolean(),
  href: z.string().startsWith("/"),
});

export type NotificationKind = z.infer<typeof notificationSchema>["kind"];
export type HubNotification = z.infer<typeof notificationSchema>;

export const notifications: HubNotification[] = z.array(notificationSchema).parse([
  {
    id: "n1",
    kind: "resposta",
    title: "Rafael Souza respondeu sua pergunta",
    body: "“Como faço a IA respeitar meu grid?”",
    timeLabel: "há 18 min",
    period: "hoje",
    isUnread: true,
    href: "/comunidade/posts/grid-layout",
  },
  {
    id: "n2",
    kind: "atividade",
    title: "Avaliação da atividade pronta",
    body: "Praticar · Ajustar espaçamento: veja o retorno da IA.",
    timeLabel: "há 1 h",
    period: "hoje",
    isUnread: true,
    href: "/educacao/praticar/ajustar-espacamento/resultado",
  },
  {
    id: "n3",
    kind: "xp",
    title: "+80 XP",
    body: "Você concluiu a Lição 02 do Módulo 01.",
    timeLabel: "há 3 h",
    period: "hoje",
    isUnread: true,
    href: "/perfil",
  },
  {
    id: "n4",
    kind: "curso",
    title: "Ana Lima publicou um minicurso",
    body: "Design tokens com IA · 4 aulas.",
    timeLabel: "há 5 h",
    period: "hoje",
    isUnread: true,
    href: "/educacao/cursos/tokens-com-ia",
  },
  {
    id: "n5",
    kind: "licao",
    title: "Nova lição disponível",
    body: "Módulo 01 · Lição 04: Componentes com IA.",
    timeLabel: "ontem",
    period: "semana",
    isUnread: false,
    href: "/educacao/licao/m1-l4",
  },
  {
    id: "n6",
    kind: "resposta",
    title: "Caio Martins respondeu na sua lição",
    body: "“O prompt de exemplo funciona no mobile também?”",
    timeLabel: "ontem",
    period: "semana",
    isUnread: false,
    href: "/comunidade/posts/prompt-mobile",
  },
  {
    id: "n7",
    kind: "nivel",
    title: "Você chegou ao nível 03",
    body: "Faltam 260 XP para o nível 04.",
    timeLabel: "há 2 dias",
    period: "semana",
    isUnread: false,
    href: "/perfil",
  },
  {
    id: "n8",
    kind: "seguidor",
    title: "Pedro Nunes começou a seguir você",
    body: "Veja o perfil e as contribuições dele.",
    timeLabel: "há 4 dias",
    period: "semana",
    isUnread: false,
    href: "/comunidade/pessoas/pedro",
  },
]);
