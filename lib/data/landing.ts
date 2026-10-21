import { z } from "zod";

/**
 * Textos FICTÍCIOS da Landing (web). Na versão real podem vir de um CMS;
 * no protótipo ficam aqui, validados no carregamento do módulo.
 */

const toneSchema = z.enum(["trilha", "pratica", "comunidade"]);

const featureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tone: toneSchema,
});

const landingSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string() }),
  features: z.array(featureSchema).length(3),
  preview: z.object({
    moduleLabel: z.string(),
    lessons: z.array(z.object({ title: z.string(), isDone: z.boolean() })),
    prompt: z.string(),
    feedback: z.string(),
  }),
  footerLinks: z.array(z.string()),
});

export type LandingFeature = z.infer<typeof featureSchema>;
export type LandingData = z.infer<typeof landingSchema>;

export const landingData: LandingData = landingSchema.parse({
  eyebrow: "Para designers",
  title: "Aprenda a utilizar IAs de código, sua imaginação é o limite.",
  subtitle:
    "Trilha prática, exercícios com feedback de IA e uma comunidade de designers para tirar dúvidas. Gratuito.",
  primaryCta: { label: "Começar agora", href: "/cadastro" },
  features: [
    {
      id: "trilha",
      title: "Trilha com checkpoints",
      description:
        "Do primeiro prompt ao site publicado, em etapas curtas. Já domina um tema? Faça a provinha e pule a etapa.",
      tone: "trilha",
    },
    {
      id: "praticar",
      title: "Praticar com feedback de IA",
      description:
        "Exercícios reais com avaliação do que funcionou e do que ajustar no seu código.",
      tone: "pratica",
    },
    {
      id: "comunidade",
      title: "Comunidade por área do design",
      description:
        "Perguntas, projetos e dicas com tag, e um fio de dúvidas em cada aula.",
      tone: "comunidade",
    },
  ],
  preview: {
    moduleLabel: "Módulo 01 · Prompts para interfaces",
    lessons: [
      { title: "O que a IA de código entende de layout", isDone: true },
      { title: "Descrevendo componentes em texto", isDone: true },
      { title: "Pedindo um layout que respeite o grid", isDone: false },
    ],
    prompt:
      "Crie um card de produto com imagem 4:3, título em 18px e botão primário. Use o grid de 8px.",
    feedback: "Espaçamentos certos. Falta o estado de foco do botão.",
  },
  footerLinks: ["Termos de uso", "Privacidade", "Contato"],
});
