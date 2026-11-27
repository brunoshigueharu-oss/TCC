import { z } from "zod";

/**
 * Textos FICTÍCIOS da Landing (web). Na versão real podem vir de um CMS;
 * no protótipo ficam aqui, validados no carregamento do módulo.
 *
 * Narrativa (docs/superpowers/specs/2026-11-13-landing-interativa-design.md):
 * herói → o que dá para criar → cenário → problema → solução → hub →
 * perguntas → chamada final.
 */

const linkSchema = z.object({ label: z.string(), href: z.string() });

/**
 * Cor de pilar de um item (paleta da marca): limão = trilha, rosa = prática,
 * azul riso = comunidade; verde-água = ação, para o que não é de um pilar.
 */
const accentSchema = z.enum(["trilha", "pratica", "comunidade", "acao"]);

/** Ids das seções com âncora: o header e o rodapé apontam para elas. */
const sectionIdSchema = z.enum(["criar", "cenario", "problema", "solucao", "hub", "perguntas"]);

/** Tópicos da solução, um por posição em volta do BASE8 (`solution-map.tsx`). */
const solutionTopicIdSchema = z.enum(["aulas", "comunidade", "cursos", "referencias", "networking"]);

const imageSchema = z.object({
  /** Caminho em `public/`. */
  src: z.string().startsWith("/"),
  alt: z.string(),
});

/** Cartão curto dos post-its (cenário e problema). */
const noteSchema = z.object({ title: z.string(), description: z.string() });

/** Post-it de problema: ao ser amassado, mostra como o hub responde àquilo. */
const problemNoteSchema = noteSchema.extend({ resolution: z.string() });

/** Dica de interação: um texto para mouse e outro para toque. */
const hintSchema = z.object({ pointer: z.string(), touch: z.string() });

/** Uma coisa que já estava pronta quando o pedido foi feito: é isso que o hub ensina. */
const behindSchema = z.object({ label: z.string(), description: z.string() });

const stagePieceSchema = z.object({
  id: z.string(),
  /** Qual peça interativa desenhar no palco. */
  kind: z.enum(["orbe", "vetorizacao", "caracteres", "manifesto", "colagem"]),
  /** Texto da barra, entre as setas. */
  name: z.string(),
  summary: z.string(),
  /** O pedido feito à IA de código, em linguagem comum. */
  prompt: z.string(),
  behind: z.array(behindSchema).min(1),
  /** Como mexer na peça; sem dica quando ela só se assiste. */
  hint: hintSchema.optional(),
});

const solutionTopicSchema = z.object({
  id: solutionTopicIdSchema,
  label: z.string(),
  accent: accentSchema,
  /** Como o hub entrega este ponto. */
  summary: z.string(),
  facts: z.array(z.string()).min(1),
  image: imageSchema,
  link: linkSchema,
});

const hubScreenSchema = z.object({
  id: z.string(),
  name: z.string(),
  accent: accentSchema,
  description: z.string(),
  highlights: z.array(z.string()).min(1),
  image: imageSchema,
  href: z.string().startsWith("/"),
});

const landingSchema = z.object({
  /** Uma linha por item; cada palavra ganha a moldura de seleção no hover. */
  titleLines: z.array(z.string()).min(1),
  subtitle: z.string(),
  primaryCta: linkSchema,
  /** Âncoras do header (e da coluna "Produto" do rodapé), na ordem das seções. */
  nav: z.array(z.object({ label: z.string(), sectionId: sectionIdSchema })).min(1),
  stage: z.object({
    id: z.literal("criar"),
    title: z.string(),
    promptLabel: z.string(),
    /** Rótulo pequeno do painel "ver o prompt" e título de cada bloco dele. */
    panelEyebrow: z.string(),
    promptHeading: z.string(),
    behindHeading: z.string(),
    pieces: z.array(stagePieceSchema).min(2),
  }),
  scenario: z.object({
    id: z.literal("cenario"),
    title: z.string(),
    /** Três momentos em sequência, ligados por setas. */
    steps: z.array(noteSchema).length(3),
  }),
  problem: z.object({
    id: z.literal("problema"),
    title: z.string(),
    /** Linha de apoio abaixo do título. */
    lead: z.string(),
    /** Dica curta ao lado do primeiro post-it, com a seta. */
    hint: hintSchema,
    /** Rótulo pequeno acima da resposta que aparece atrás do post-it amassado. */
    resolutionLabel: z.string(),
    resetLabel: z.string(),
    points: z.array(problemNoteSchema).length(3),
  }),
  solution: z.object({
    id: z.literal("solucao"),
    title: z.string(),
    /** Subtítulo: `lead` + palavra em destaque. */
    lead: z.string(),
    highlight: z.string(),
    /** Rótulo pequeno do painel de cada tópico. */
    topicEyebrow: z.string(),
    /** Dica das letras 3D: cada uma troca de material. */
    /** Cada tópico tem a sua posição em volta do BASE8, pelo `id` (ver `solution-map.tsx`). */
    topics: z
      .array(solutionTopicSchema)
      .length(solutionTopicIdSchema.options.length)
      .refine((topics) => new Set(topics.map((topic) => topic.id)).size === topics.length, "Tópico repetido"),
  }),
  hub: z
    .object({
      id: z.literal("hub"),
      title: z.string(),
      /** Tela que abre no centro do carrossel. */
      initialId: z.string(),
      screenEyebrow: z.string(),
      openLabel: z.string(),
      screens: z.array(hubScreenSchema).min(3),
    })
    .refine((hub) => hub.screens.some((screen) => screen.id === hub.initialId), {
      message: "`initialId` precisa ser o id de uma das telas",
      path: ["initialId"],
    }),
  faq: z.object({
    id: z.literal("perguntas"),
    title: z.string(),
    /** Dica dos objetos soltos nas margens (só em telas largas, onde eles aparecem). */
    hint: hintSchema,
    items: z.array(z.object({ id: z.string(), question: z.string(), answer: z.string() })).min(3),
  }),
  closing: z.object({
    /** Linhas do título antes da palavra animada. */
    titleLead: z.array(z.string()).min(1),
    /** Palavra que troca de letras sozinha. */
    titleWord: z.string(),
    titleEnd: z.string(),
    /** Linha abaixo do botão (o botão é o `primaryCta`, o mesmo do herói e do header). */
    note: z.string(),
  }),
  footer: z.object({
    tagline: z.string(),
    /** Título da coluna que repete as âncoras do header. */
    sectionsTitle: z.string(),
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

export type LandingNote = z.infer<typeof noteSchema>;
export type InteractionHintText = z.infer<typeof hintSchema>;
export type StagePiece = z.infer<typeof stagePieceSchema>;
export type StagePieceKind = StagePiece["kind"];
export type SolutionTopic = z.infer<typeof solutionTopicSchema>;
export type SolutionTopicId = z.infer<typeof solutionTopicIdSchema>;
export type Accent = z.infer<typeof accentSchema>;
export type SectionId = z.infer<typeof sectionIdSchema>;
export type HubScreen = z.infer<typeof hubScreenSchema>;
export type LandingData = z.infer<typeof landingSchema>;

export const landingData: LandingData = landingSchema.parse({
  titleLines: ["Sua imaginação", "é o limite."],
  subtitle: "Aprenda a forma correta de usar IAs de código no mundo criativo.",
  primaryCta: { label: "Criar conta", href: "/cadastro" },
  nav: [
    { label: "O que dá para criar", sectionId: "criar" },
    { label: "A plataforma", sectionId: "solucao" },
    { label: "O hub", sectionId: "hub" },
    { label: "Perguntas", sectionId: "perguntas" },
  ],
  stage: {
    id: "criar",
    title: "O que dá para criar?",
    promptLabel: "Ver como foi feito",
    panelEyebrow: "Como foi feito",
    promptHeading: "O pedido",
    behindHeading: "O que já estava configurado",
    pieces: [
      {
        id: "manifesto",
        kind: "manifesto",
        name: "Um motion design",
        summary: "O manifesto do BASE8: cada quadro é desenhado a partir do tempo, sem programa de animação.",
        prompt:
          "Anime o manifesto do BASE8 seguindo este roteiro: uma bola azul abre caminho, mostra exemplos reais e no fim vira a bola 8 da logo.",
        behind: [
          {
            label: "Roteiro e direção",
            description: "O roteiro e as notas de direção ficam no projeto, e a IA lê os dois antes de animar.",
          },
          {
            label: "Preview ao vivo",
            description: "O filme toca direto do código e as notas são deixadas nos quadros, sem esperar render.",
          },
          {
            label: "Trilha no Ableton",
            description: "A música é feita no ritmo do filme, com o tempo de cada cena marcado em batidas.",
          },
        ],
      },
      {
        id: "objetos-3d",
        kind: "orbe",
        name: "Objetos 3D",
        summary: "Sem modelo pronto e sem imagem: forma, material e luz foram escritos em código.",
        prompt:
          "Quero objetos redondos em 3D que viram um no outro: bolinha de gude, bolha de sabão, bússola, bola 8 e bola de tênis. Realistas como foto, tudo em código, sem modelo pronto e sem imagem.",
        hint: { pointer: "Arraste para girar e escolha um objeto", touch: "Arraste para girar e toque num objeto" },
        behind: [
          {
            label: "Bibliotecas 3D",
            description: "three.js e React Three Fiber já instaladas no repositório do projeto.",
          },
          {
            label: "Texturas por código",
            description: "Riscos, relevo e o número são pintados na hora, sem arquivo de imagem.",
          },
          {
            label: "Rodadas de revisão",
            description: "Cada versão foi comparada com fotos de referência antes do próximo ajuste.",
          },
          {
            label: "Memória do projeto",
            description: "As decisões de cada rodada ficam anotadas, para a IA não repetir o que já foi descartado.",
          },
        ],
      },
      {
        id: "vetorizacao",
        kind: "vetorizacao",
        name: "Um rascunho transformado em vetor",
        summary: "O lettering do BASE8 saiu do lápis para curvas editáveis, com uma camada por objeto.",
        prompt:
          "Vetorize este rascunho do lettering. As linhas devem ficar o mais próximas possível do desenho, com o jeito orgânico do lápis, e cada objeto em uma camada.",
        hint: { pointer: "Arraste o divisor", touch: "Arraste o divisor" },
        behind: [
          {
            label: "Script de traçado",
            description:
              "Um programa em Python, escrito pela IA, acha a linha central de cada traço e a converte em curvas.",
          },
          {
            label: "Script do Illustrator",
            description: "Outro script monta o arquivo .ai, com uma camada para cada objeto do desenho.",
          },
          {
            label: "Conferência",
            description: "O vetor é sobreposto ao rascunho para checar a fidelidade antes da entrega.",
          },
        ],
      },
      {
        id: "colagem",
        kind: "colagem",
        name: "Editar imagens",
        summary:
          "Os pinos, os post-its, a lupa e as lâmpadas desta página saíram de fotos comuns, tratadas por um script.",
        prompt:
          "Transforme estas fotos em adesivos de colagem: poucos tons chapados, retícula, traço à mão e borda de papel recortado. Em alta resolução e com fundo transparente.",
        behind: [
          {
            label: "Script de tratamento",
            description:
              "Um programa em Python, escrito pela IA, separa as áreas de cada foto por luz e cor e pinta cada uma num tom.",
          },
          {
            label: "Kit de efeitos",
            description:
              "Retícula, traço e borda de papel ficam num arquivo à parte, para valer em qualquer objeto novo.",
          },
          {
            label: "Ampliação antes",
            description: "As fotos passam por um ampliador de imagem antes do script, para o recorte sair limpo.",
          },
        ],
        hint: { pointer: "Arraste os objetos de um lado para o outro", touch: "Arraste os objetos de um lado para o outro" },
      },
    ],
  },
  scenario: {
    id: "cenario",
    title: "Você já esteve nessa situação?",
    steps: [
      {
        title: "Pessoas do mundo criativo",
        description: "Designers, publicitários, ilustradores: gente que vive de transformar ideia em imagem.",
      },
      {
        title: "Ideia ou necessidade",
        description:
          "Um portfólio que se mexe, uma ferramenta que ainda não existe, uma tarefa repetitiva que podia se resolver sozinha.",
      },
      {
        title: "Como fazer?",
        description: "A IA de código já constrói boa parte disso. Falta saber por onde começar.",
      },
    ],
  },
  problem: {
    id: "problema",
    title: "O que impede você de começar?",
    lead: "As três travas que mais aparecem nas conversas com quem cria.",
    hint: { pointer: "Clique para amassar", touch: "Toque para amassar" },
    resolutionLabel: "No BASE8",
    resetLabel: "Repor os post-its",
    points: [
      {
        title: "Não ter conhecimento técnico",
        description: "Repositório, terminal, instalação: os termos assustam antes mesmo do primeiro passo.",
        resolution: "A trilha começa do zero: repositório, terminal e instalação, um passo de cada vez.",
      },
      {
        title: "Não conhecer as possibilidades",
        description: "Sem ver exemplos, parece que IA de código só serve para fazer site.",
        resolution: "Exemplos reais, do objeto 3D à vetorização, com o que estava configurado por trás de cada um.",
      },
      {
        title: "Achar que código está limitado a programadores",
        description: "Quem nunca programou imagina que não tem lugar ali.",
        resolution: "Você dirige o resultado com o olhar de designer; a IA escreve o código.",
      },
    ],
  },
  solution: {
    id: "solucao",
    title: "Comece por aqui.",
    lead: "Conheça a plataforma",
    highlight: "gratuita",
    topicEyebrow: "Como é entregue",
    topics: [
      {
        id: "aulas",
        accent: "trilha",
        label: "Aulas do básico ao avançado",
        summary:
          "Uma trilha em módulos curtos. Começa pelo que é um repositório e como instalar uma IA de código, e chega a skills, MCPs e agentes.",
        facts: [
          "Lições de 5 a 10 minutos",
          "Checkpoint no fim de cada módulo",
          "Teste de proficiência para pular o que você já sabe",
          "Primeiras aulas gratuitas; o curso completo é pago",
        ],
        image: {
          src: "/landing/hub/trilha.webp",
          alt: "Tela da trilha no hub, com o módulo em andamento e o mapa das lições",
        },
        link: { label: "Ver a trilha", href: "/educacao" },
      },
      {
        id: "comunidade",
        accent: "comunidade",
        label: "Comunidade de criativos",
        summary:
          "Um espaço de perguntas, projetos e dicas, organizado por tema do design. Cada aula também tem o próprio fio de dúvidas.",
        facts: [
          "Perguntas com resposta aceita",
          "Filtros por tema: layout, componentes, ferramentas",
          "Fio de dúvidas dentro de cada aula",
        ],
        image: {
          src: "/landing/hub/comunidade.webp",
          alt: "Tela da comunidade no hub, com o destaque da semana e a lista de posts",
        },
        link: { label: "Ver a comunidade", href: "/comunidade" },
      },
      {
        id: "cursos",
        accent: "comunidade",
        label: "Cursos da comunidade",
        summary:
          "Minicursos gratuitos criados por designers da própria comunidade. Quem domina um assunto monta as aulas e publica depois da moderação.",
        facts: ["Editor de minicurso no próprio hub", "Moderação antes de publicar", "Fio de dúvidas em cada aula"],
        image: {
          src: "/landing/hub/cursos.webp",
          alt: "Tela dos cursos da comunidade no hub, com o curso em andamento e a estante",
        },
        link: { label: "Ver os cursos", href: "/educacao/cursos" },
      },
      {
        id: "referencias",
        accent: "pratica",
        label: "Referências de uso das IAs de código",
        summary:
          "No perfil, a seção Uso das IAs mostra quanto e em que horários você usa cada ferramenta. Na comunidade, os posts mostram como outras pessoas chegaram ao resultado.",
        facts: ["Conexão com Claude, Codex e Copilot", "Uso por dia e por hora", "Comparação com a semana anterior"],
        image: {
          src: "/landing/hub/uso-ias.webp",
          alt: "Seção Uso das IAs do perfil, com o total da semana e o gráfico por dia",
        },
        link: { label: "Ver no perfil", href: "/perfil" },
      },
      {
        id: "networking",
        accent: "comunidade",
        label: "Networking",
        summary:
          "Cada pessoa tem um perfil público com nível, selos, posts e minicursos. Dá para ver quem procura colaboradores e acompanhar o ranking de amigos.",
        facts: [
          "Perfil público com selos de proficiência",
          "Aviso de quem procura colaboradores",
          "Ranking semanal entre amigos",
        ],
        image: {
          src: "/landing/hub/pessoa.webp",
          alt: "Perfil público de uma pessoa no hub, com nível, posts, selos e minicursos",
        },
        link: { label: "Ver um perfil", href: "/comunidade/pessoas/rafael" },
      },
    ],
  },
  hub: {
    id: "hub",
    title: "Conheça o hub",
    initialId: "trilha",
    screenEyebrow: "Área do hub",
    openLabel: "Abrir no hub",
    screens: [
      {
        id: "trilha",
        accent: "trilha",
        name: "Trilha de aprendizado",
        description: "O caminho principal: módulos em ordem, com o progresso sempre à vista.",
        highlights: ["Continue de onde parou", "Mapa do módulo com as lições", "Atalho para o teste de proficiência"],
        image: { src: "/landing/hub/trilha.webp", alt: "Tela da trilha no hub" },
        href: "/educacao",
      },
      {
        id: "comunidade",
        accent: "comunidade",
        name: "Comunidade",
        description: "Dúvidas e discussões da turma, com destaque da semana e filtros por tema.",
        highlights: ["Destaque da semana", "Posts sem resposta em evidência", "Tags para seguir"],
        image: { src: "/landing/hub/comunidade.webp", alt: "Tela da comunidade no hub" },
        href: "/comunidade",
      },
      {
        id: "praticar",
        accent: "pratica",
        name: "Praticar",
        description: "Atividades curtas, avaliadas na hora.",
        highlights: ["Resultado simulado ao lado", "Parecer com o que ajustar", "Pontos de experiência por atividade"],
        image: { src: "/landing/hub/praticar.webp", alt: "Tela de prática no hub, com uma atividade aberta" },
        href: "/educacao/praticar",
      },
      {
        id: "cursos",
        accent: "comunidade",
        name: "Cursos da comunidade",
        description: "Minicursos gratuitos criados por designers da comunidade.",
        highlights: ["Continue assistindo", "Estante por tema", "Crie o seu minicurso"],
        image: { src: "/landing/hub/cursos.webp", alt: "Tela dos cursos da comunidade no hub" },
        href: "/educacao/cursos",
      },
      {
        id: "proficiencia",
        accent: "trilha",
        name: "Teste de proficiência",
        description: "Prove o que você já sabe e libere os módulos seguintes.",
        highlights: ["10 questões em 20 minutos", "Aprovação com 70%", "Selo no perfil"],
        image: { src: "/landing/hub/proficiencia.webp", alt: "Tela do teste de proficiência no hub" },
        href: "/educacao/proficiencia",
      },
      {
        id: "perfil",
        accent: "acao",
        name: "Perfil",
        description: "Seu nível, sua sequência e o que você já conquistou.",
        highlights: ["Progresso na trilha", "Selos de proficiência", "Uso das IAs conectadas"],
        image: { src: "/landing/hub/perfil.webp", alt: "Tela de perfil no hub" },
        href: "/perfil",
      },
    ],
  },
  faq: {
    id: "perguntas",
    title: "Perguntas frequentes",
    hint: { pointer: "Arraste os objetos pela mesa", touch: "Arraste os objetos pela mesa" },
    items: [
      {
        id: "programar",
        question: "Preciso saber programar?",
        answer:
          "Não. A trilha parte do que você já domina no design e apresenta o código aos poucos, só o necessário para entender e dirigir o que a IA constrói.",
      },
      {
        id: "aprendo",
        question: "O que eu aprendo no BASE8?",
        answer:
          "A entender o sistema por trás das ferramentas: o que é um repositório, como instalar e configurar uma IA de código, o que são skills, MCPs e agentes. Esse conhecimento vale para qualquer ferramenta do mercado.",
      },
      {
        id: "sites",
        question: "Dá para criar só sites?",
        answer:
          "Não. Site é só uma parte. Com IA de código dá para vetorizar um desenho, montar uma apresentação, automatizar tarefas no Figma e no Illustrator, editar vídeo, tratar imagens e criar ferramentas próprias.",
      },
      {
        id: "tempo",
        question: "Quanto tempo leva?",
        answer:
          "Cada lição dura de 5 a 10 minutos e o ritmo é seu. Quem já conhece um tema faz o teste de proficiência e pula o módulo.",
      },
      {
        id: "celular",
        question: "Funciona no celular?",
        answer:
          "Sim. A trilha e a comunidade foram pensadas para o celular. As atividades de prática também abrem nele, mas rendem mais em uma tela maior.",
      },
      {
        id: "preco",
        question: "Quanto custa?",
        answer:
          "Criar a conta e usar o hub é gratuito: comunidade, minicursos da comunidade e as primeiras aulas da trilha. O curso completo é pago.",
      },
    ],
  },
  closing: {
    titleLead: ["Aprenda a alcançar", "o seu maior"],
    titleWord: "potencial",
    titleEnd: ".",
    note: "Consiga acesso antecipado",
  },
  footer: {
    tagline: "Hub para designers aprenderem a usar IA de código.",
    sectionsTitle: "Produto",
    columns: [
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
