import { z } from "zod";

/**
 * Textos FICTÍCIOS da Landing (web). Na versão real podem vir de um CMS;
 * no protótipo ficam aqui, validados no carregamento do módulo.
 */

const toneSchema = z.enum(["trilha", "pratica", "comunidade", "acao"]);

const sectionIntroSchema = z.object({
  /** Âncora da seção (`#id`), usada no header e no rodapé. */
  id: z.string(),
  /** Rótulo curto em caixa alta, ao lado do número da seção. */
  eyebrow: z.string(),
  title: z.string(),
});

/** Amostra de cada pilar: um recorte pequeno do que a pessoa encontra no hub. */
const pillarSampleSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("licoes"),
    label: z.string(),
    lessons: z.array(z.object({ title: z.string(), minutes: z.number().int().positive(), isDone: z.boolean() })).min(1),
  }),
  z.object({
    kind: z.literal("parecer"),
    label: z.string(),
    prompt: z.string(),
    notes: z.array(z.object({ text: z.string(), isPositive: z.boolean() })).min(1),
  }),
  z.object({
    kind: z.literal("pergunta"),
    label: z.string(),
    tag: z.string(),
    question: z.string(),
    author: z.string(),
    answers: z.number().int().nonnegative(),
    reply: z.string(),
  }),
  z.object({
    kind: z.literal("nota"),
    label: z.string(),
    value: z.string(),
    caption: z.string(),
    facts: z.array(z.string()).min(1),
  }),
]);

const pillarSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  description: z.string(),
  tone: toneSchema,
  sample: pillarSampleSchema,
});

const demoStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** Trecho que esta versão acrescenta ao prompt (o texto se acumula). */
  addition: z.string(),
  /** Parecer curto sobre o resultado desta versão. */
  verdict: z.string(),
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
  /** Âncoras do header, na ordem das seções. */
  nav: z.array(z.object({ label: z.string(), href: z.string().startsWith("#") })).min(1),
  problem: sectionIntroSchema.extend({
    points: z.array(z.object({ title: z.string(), description: z.string() })).length(3),
  }),
  pillars: sectionIntroSchema.extend({
    items: z.array(pillarSchema).length(4),
  }),
  demo: sectionIntroSchema.extend({
    description: z.string(),
    product: z.object({ name: z.string(), price: z.string(), tag: z.string(), cta: z.string() }),
    steps: z.array(demoStepSchema).length(3),
  }),
  proof: sectionIntroSchema.extend({
    stats: z
      .array(z.object({ value: z.number().int().nonnegative(), suffix: z.string().optional(), label: z.string() }))
      .length(4),
    quote: z.object({ text: z.string(), author: z.string(), role: z.string() }),
  }),
  faq: sectionIntroSchema.extend({
    items: z.array(z.object({ id: z.string(), question: z.string(), answer: z.string() })).min(3),
  }),
  closing: z.object({
    titleLines: z.array(z.string()).min(1),
    subtitle: z.string(),
    primaryCta: z.object({ label: z.string(), href: z.string() }),
    secondaryCta: z.object({ label: z.string(), href: z.string() }),
  }),
  footer: z.object({
    tagline: z.string(),
    columns: z
      .array(
        z.object({
          title: z.string(),
          /** Sem `href` = página que ainda não existe (aparece como "em breve"). */
          links: z.array(z.object({ label: z.string(), href: z.string().optional() })).min(1),
        }),
      )
      .min(1),
    note: z.string(),
  }),
});

export type ShowcaseItem = z.infer<typeof showcaseItemSchema>;
export type LandingTone = z.infer<typeof toneSchema>;
export type LandingPillar = z.infer<typeof pillarSchema>;
export type LandingPillarSample = z.infer<typeof pillarSampleSchema>;
export type LandingDemoStep = z.infer<typeof demoStepSchema>;
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
  nav: [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Demonstração", href: "#demonstracao" },
    { label: "Números", href: "#numeros" },
    { label: "Perguntas", href: "#perguntas" },
  ],
  problem: {
    id: "problema",
    eyebrow: "O problema",
    title:
      "Você sabe exatamente o que quer ver na tela. O difícil é explicar isso para uma IA que escreve código.",
    points: [
      {
        title: "Prompt vago, resultado genérico",
        description:
          "Pedir “um site bonito” devolve o layout que todo mundo recebe. Falta vocabulário para descrever grid, hierarquia e estado.",
      },
      {
        title: "Código que roda e ninguém entende",
        description:
          "A interface aparece, mas você não sabe o que mudar quando algo quebra. Cada ajuste vira tentativa e erro.",
      },
      {
        title: "Curso feito para quem programa",
        description:
          "Quase todo material parte do terminal e da lógica. Pouco parte do que o designer já domina: composição, tipografia e sistema.",
      },
    ],
  },
  pillars: {
    id: "como-funciona",
    eyebrow: "Como funciona",
    title: "Quatro frentes, um mesmo caminho.",
    items: [
      {
        id: "trilha",
        name: "Trilha",
        title: "Do primeiro prompt ao site publicado",
        description:
          "Módulos curtos, em ordem, com um checkpoint no fim de cada um. Já domina um tema? Faça a prova rápida e pule a etapa.",
        tone: "trilha",
        sample: {
          kind: "licoes",
          label: "Módulo 01 · Prompts para interfaces",
          lessons: [
            { title: "O que a IA de código entende de layout", minutes: 6, isDone: true },
            { title: "Descrevendo componentes em texto", minutes: 8, isDone: true },
            { title: "Pedindo um layout que respeite o grid", minutes: 7, isDone: false },
          ],
        },
      },
      {
        id: "pratica",
        name: "Prática",
        title: "Exercícios com parecer na hora",
        description:
          "Você escreve o prompt, a IA devolve a interface e um parecer objetivo: o que funcionou e o que ajustar antes de seguir.",
        tone: "pratica",
        sample: {
          kind: "parecer",
          label: "Exercício · Card de produto",
          prompt: "Crie um card com imagem 4:3, título em 18px e botão primário. Use o grid de 8px.",
          notes: [
            { text: "Espaçamentos seguem o grid de 8px", isPositive: true },
            { text: "Hierarquia do título está clara", isPositive: true },
            { text: "Falta o estado de foco do botão", isPositive: false },
          ],
        },
      },
      {
        id: "comunidade",
        name: "Comunidade",
        title: "Respostas de quem é da sua área",
        description:
          "Perguntas, projetos e dicas organizados por área do design, e um fio de dúvidas dentro de cada aula.",
        tone: "comunidade",
        sample: {
          kind: "pergunta",
          label: "Fio de dúvidas · UI",
          tag: "UI",
          question: "Como peço um componente que respeite os tokens do meu design system?",
          author: "Lívia Tanaka",
          answers: 3,
          reply: "Cole os tokens no início do prompt e peça para a IA usar só os nomes deles, sem valores soltos.",
        },
      },
      {
        id: "proficiencia",
        name: "Proficiência",
        title: "Um teste que comprova o que você sabe",
        description:
          "Prova com tempo e nota mínima. A aprovação rende um selo no perfil e libera os módulos que você ainda não fez.",
        tone: "acao",
        sample: {
          kind: "nota",
          label: "Teste de proficiência",
          value: "70%",
          caption: "nota mínima para aprovação",
          facts: ["2 minutos por questão", "Selo no perfil", "Libera módulos da trilha"],
        },
      },
    ],
  },
  demo: {
    id: "demonstracao",
    eyebrow: "Demonstração",
    title: "O mesmo pedido, escrito três vezes.",
    description:
      "É o primeiro exercício da trilha: a cada detalhe que você acrescenta ao prompt, a interface deixa de ser a de todo mundo e passa a ser a sua.",
    product: { name: "Cadeira Cantilever", price: "R$ 1.240", tag: "Novo", cta: "Comprar" },
    steps: [
      {
        id: "vago",
        label: "Vago",
        addition: "Faça um card de produto bonito.",
        verdict: "Funciona, mas é o card que todo mundo recebe.",
      },
      {
        id: "medidas",
        label: "Com medidas",
        addition: "Imagem 4:3, título em 18px, preço em mono e botão primário. Use o grid de 8px.",
        verdict: "Agora a hierarquia é sua: proporção, tamanho e ritmo definidos.",
      },
      {
        id: "estados",
        label: "Com estados",
        addition: "Inclua o selo de novidade e o estado de foco do botão.",
        verdict: "Pronto para uso: estados previstos e navegação pelo teclado.",
      },
    ],
  },
  proof: {
    id: "numeros",
    eyebrow: "Em números",
    title: "Curto o bastante para caber na sua semana.",
    stats: [
      { value: 6, label: "módulos, do primeiro prompt ao site publicado" },
      { value: 32, label: "lições curtas, de 5 a 10 minutos cada" },
      { value: 48, label: "exercícios com parecer da IA" },
      { value: 70, suffix: "%", label: "nota mínima no teste de proficiência" },
    ],
    quote: {
      text: "Em três semanas publiquei meu portfólio sem depender de ninguém. A diferença foi aprender a pedir.",
      author: "Marina Sato",
      role: "Designer de produto",
    },
  },
  faq: {
    id: "perguntas",
    eyebrow: "Perguntas frequentes",
    title: "Antes de começar.",
    items: [
      {
        id: "programar",
        question: "Preciso saber programar?",
        answer:
          "Não. A trilha parte do que você já domina (grid, tipografia, hierarquia) e apresenta o código aos poucos, só o necessário para ler e ajustar o que a IA escreve.",
      },
      {
        id: "ferramentas",
        question: "Quais ferramentas de IA o BASE8 ensina?",
        answer:
          "O que você aprende é o método: descrever, revisar e corrigir. Ele vale para qualquer IA de código. Os exemplos usam ferramentas conhecidas do mercado, e você pratica com a que preferir.",
      },
      {
        id: "tempo",
        question: "Quanto tempo leva?",
        answer:
          "Cada lição dura de 5 a 10 minutos e o ritmo é seu. Quem já conhece um tema faz a prova do checkpoint e pula o módulo inteiro.",
      },
      {
        id: "celular",
        question: "Funciona no celular?",
        answer:
          "Sim. A trilha e a comunidade foram pensadas para o celular. Os exercícios de prática também abrem nele, mas rendem mais em uma tela maior.",
      },
      {
        id: "proficiencia",
        question: "Para que serve o teste de proficiência?",
        answer:
          "Para comprovar o que você já sabe. Com 70% de acerto você recebe um selo no perfil e libera os módulos que ainda não fez, sem repetir conteúdo.",
      },
      {
        id: "preco",
        question: "Quanto custa?",
        answer: "Nesta fase de lançamento, o acesso ao hub é gratuito. Basta criar a conta.",
      },
    ],
  },
  closing: {
    titleLines: ["O primeiro prompt", "é o mais difícil."],
    subtitle: "Os próximos você escreve sabendo o que pedir.",
    primaryCta: { label: "Criar conta", href: "/cadastro" },
    secondaryCta: { label: "Já tenho conta", href: "/entrar" },
  },
  footer: {
    tagline: "Hub para designers aprenderem a usar IA de código.",
    columns: [
      {
        title: "Produto",
        links: [
          { label: "Como funciona", href: "#como-funciona" },
          { label: "Demonstração", href: "#demonstracao" },
          { label: "Números", href: "#numeros" },
          { label: "Perguntas", href: "#perguntas" },
        ],
      },
      {
        title: "Hub",
        links: [
          { label: "Criar conta", href: "/cadastro" },
          { label: "Entrar", href: "/entrar" },
          { label: "Trilha", href: "/educacao" },
          { label: "Comunidade", href: "/comunidade" },
        ],
      },
      {
        title: "Institucional",
        links: [{ label: "Termos de uso" }, { label: "Privacidade" }, { label: "Contato" }],
      },
    ],
    note: "Trabalho de conclusão de curso em Design",
  },
});
