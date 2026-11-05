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

const showcaseItemSchema = z.object({
  id: z.string(),
  /** Rótulo acima da peça, como o nome de um frame no canvas. */
  caption: z.string(),
  /** Site de verdade, aberto em nova aba. */
  url: z.url(),
  /** Print local (`/showcase/...`) ou imagem de divulgação do próprio site. */
  image: z.string(),
  imageAlt: z.string(),
});

const landingSchema = z.object({
  /** Uma linha por item; cada palavra ganha a moldura de seleção no hover. */
  titleLines: z.array(z.string()).min(1),
  subtitle: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string() }),
  showcase: z.object({
    title: z.string(),
    /** Peça que abre no centro da faixa. */
    initialId: z.string(),
    items: z.array(showcaseItemSchema).min(3),
  }),
  features: z.array(featureSchema).length(3),
  preview: z.object({
    moduleLabel: z.string(),
    lessons: z.array(z.object({ title: z.string(), isDone: z.boolean() })),
    prompt: z.string(),
    feedback: z.string(),
  }),
  footerLinks: z.array(z.string()),
});

export type ShowcaseItem = z.infer<typeof showcaseItemSchema>;
export type LandingFeature = z.infer<typeof featureSchema>;
export type LandingData = z.infer<typeof landingSchema>;

export const landingData: LandingData = landingSchema.parse({
  titleLines: ["Sua imaginação", "é o limite."],
  subtitle: "Aprenda a forma correta de usar IAs de código no mundo criativo.",
  primaryCta: { label: "Começar agora", href: "/cadastro" },
  showcase: {
    title: "O que dá pra criar com IA de código",
    initialId: "portfolio",
    items: [
      {
        id: "jogo",
        caption: "Um jogo no navegador",
        url: "https://fly.pieter.com",
        image: "https://fly.pieter.com/assets/fly_social_image.png",
        imageAlt: "Simulador de voo multijogador fly.pieter.com, com aviões sobre um cenário em blocos",
      },
      {
        id: "site",
        caption: "Um site de estúdio",
        url: "https://lusion.co",
        image: "https://lusion.co/assets/meta/social_sharing.jpg",
        imageAlt: "Site do estúdio Lusion, com peças 3D azuis, brancas e pretas",
      },
      {
        id: "portfolio",
        caption: "Um portfólio que se mexe",
        url: "https://bruno-simon.com",
        image: "https://bruno-simon.com/social/share-image.png",
        imageAlt: "Portfólio 3D de Bruno Simon, com um carrinho vermelho em um cenário de blocos",
      },
      {
        id: "crm",
        caption: "Um sistema para seus clientes",
        url: "https://twenty.com",
        image: "/showcase/crm-twenty.jpg",
        imageAlt: "CRM Twenty, com tabela de empresas e um chat de IA ao lado",
      },
      {
        id: "audio",
        caption: "Um plugin de áudio",
        url: "https://vital.audio",
        image: "/showcase/audio-vital.jpg",
        imageAlt: "Site do sintetizador Vital, com o logo em V roxo sobre fundo escuro",
      },
      {
        id: "video",
        caption: "Um vídeo gerado em código",
        url: "https://www.githubunwrapped.com",
        image: "/showcase/video-github-unwrapped.jpg",
        imageAlt: "GitHub Unwrapped, que gera um vídeo personalizado do ano de cada pessoa",
      },
    ],
  },
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
