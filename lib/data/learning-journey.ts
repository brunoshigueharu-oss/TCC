import { z } from "zod";

const branchStatusSchema = z.enum(["concluido", "ativo", "insight", "nao-iniciado"]);
const commitKindSchema = z.enum(["default", "flag", "insight"]);

const commitSchema = z.object({
  label: z.string(),
  description: z.string(),
  kind: commitKindSchema.default("default"),
});

const branchSchema = z.object({
  id: z.string(),
  name: z.string(),
  meta: z.string(),
  metaHref: z.string().url().optional(),
  status: branchStatusSchema,
  intro: z.string(),
  commits: z.array(commitSchema),
  openNote: z.string().optional(),
  reflection: z.string().optional(),
});

const trunkItemSchema = z.object({
  label: z.string(),
  before: z.string(),
  after: z.string(),
});

const sourceSchema = z.object({
  label: z.string(),
  href: z.string().url(),
});

const journeySchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubhead: z.string(),
  startDate: z.string(),
  updatedDate: z.string(),
  branches: z.array(branchSchema).min(1),
  trunkItems: z.array(trunkItemSchema).min(1),
  sources: z.array(sourceSchema),
});

export type BranchStatus = z.infer<typeof branchStatusSchema>;
export type CommitKind = z.infer<typeof commitKindSchema>;
export type Commit = z.infer<typeof commitSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type TrunkItem = z.infer<typeof trunkItemSchema>;
export type Journey = z.infer<typeof journeySchema>;

export const learningJourney: Journey = journeySchema.parse({
  heroEyebrow: "registro pessoal · desde 9 de agosto de 2026",
  heroTitle: "Pensar antes de commitar.",
  heroSubhead:
    "Um grafo de commits em vez de um mapa mental: cada estação abaixo é um curso ou um projeto onde venho aprendendo, na prática, a trabalhar com o Claude Code. Do primeiro curso até descobrir que o diferencial de um designer nessa relação não é saber programar — é saber estruturar o pensamento antes de conversar com a ferramenta.",
  startDate: "9 de agosto de 2026",
  updatedDate: "27 de agosto de 2026",
  branches: [
    {
      id: "curso-udemy",
      name: "Curso Udemy",
      meta: "curso · Claude Code do zero ao avançado",
      metaHref: "https://www.udemy.com/course/claude-code-do-zero-ao-avancado/",
      status: "concluido",
      intro:
        "Primeiro contato com o Claude Code — o ponto de partida de toda a jornada, ainda dentro de um curso introdutório sobre geração de código com IA.",
      commits: [
        {
          label: "agentes & comandos",
          description:
            "Entender o que são agentes dentro do Claude Code, os comandos disponíveis e para que serve cada função.",
          kind: "default",
        },
        {
          label: "hooks",
          description:
            "Primeiro contato com hooks — automações que disparam em resposta a eventos do próprio Claude Code.",
          kind: "default",
        },
        {
          label: "claude.md",
          description:
            "Entender a função do arquivo CLAUDE.md como memória e instrução persistente do projeto.",
          kind: "default",
        },
        {
          label: "integração no vs code",
          description:
            "Configurar o Claude Code para uso diário dentro do VS Code — interface que sigo usando até hoje por dar mais liberdade visual do que o terminal puro.",
          kind: "default",
        },
      ],
    },
    {
      id: "hocus-pocus",
      name: "Hocus Pocus",
      meta: "projeto para uma empresa · em desenvolvimento",
      status: "ativo",
      intro:
        "Nasceu logo depois do curso, aplicando o que tinha sido aprendido — mas cresceu muito além de um exercício. Hoje é um projeto real, sendo desenvolvido para uma empresa, e segue em andamento. É totalmente separado do curso: não é o exercício dele, é maior e independente.",
      commits: [
        {
          label: "primeira aplicação",
          description:
            "Construir uma aplicação web bem simples só para testar até onde ia o potencial do Claude Code.",
          kind: "default",
        },
        {
          label: "crescimento contínuo",
          description:
            "O escopo e o conhecimento sobre o Claude Code foram crescendo junto com o projeto, que segue em desenvolvimento até hoje.",
          kind: "default",
        },
      ],
    },
    {
      id: "curso-elite",
      name: "Curso EliteDaIA",
      meta: "curso · segurança web + vibe coding",
      metaHref: "https://elitedaia.com.br",
      status: "concluido",
      intro:
        'Segundo curso, focado em segurança web e em programar no estilo "vibe coding" — sem ser, de fato, programador.',
      commits: [
        {
          label: "revisão, não novidade",
          description:
            "Boa parte dos processos do Claude Code já tinha sido vista no curso anterior — pouco ganho novo por aqui.",
          kind: "default",
        },
        {
          label: "segurança",
          description:
            "Aprender a identificar e corrigir vulnerabilidades em código, mesmo sem saber programar profissionalmente.",
          kind: "default",
        },
        {
          label: "deploy real",
          description: "Colocar um site no ar de verdade: Hostinger + VPS para hospedagem.",
          kind: "default",
        },
        {
          label: "dados de cliente",
          description:
            "Entender como funciona o armazenamento de dados de um sistema para os clientes que o usariam.",
          kind: "default",
        },
      ],
      openNote: "em aberto: ainda não entendo bem backend",
    },
    {
      id: "tcc",
      name: "TCC (pesquisa)",
      meta: "pesquisa acadêmica · branch ativa — você está aqui",
      status: "ativo",
      intro:
        "Aplicar o Claude Code na própria pesquisa do TCC: da busca de referências à formalização do texto final.",
      commits: [
        { label: "fontes", description: "Buscar fontes e referências para embasar a pesquisa.", kind: "default" },
        {
          label: "estrutura da pesquisa",
          description:
            "Mapear o que eu queria descobrir e pedir ajuda para transformar isso numa investigação organizada.",
          kind: "default",
        },
        {
          label: "formalização em abnt",
          description:
            "Pedir para transformar o que já tinha sido discutido em um documento Word formatado nas normas ABNT.",
          kind: "default",
        },
        {
          label: "esta página",
          description: "Documentar a própria curva de aprendizado — a timeline que você está vendo agora.",
          kind: "default",
        },
      ],
    },
    {
      id: "bruno-higashis-mind",
      name: "Bruno Higashi's Mind",
      meta: "projeto pessoal · sistema gamificado de rotina e tarefas",
      status: "insight",
      intro:
        "Projeto pessoal para testar até onde a IA agêntica vai dentro do processo criativo — e onde veio a lição mais importante da jornada até aqui.",
      commits: [
        {
          label: "erro de escopo",
          description:
            "Descrevi a ideia de forma genérica demais. Resultado: muito crédito gasto e o projeto não saiu do lugar, sem chegar no que eu queria.",
          kind: "flag",
        },
        {
          label: "gestão de tokens — a ficha caiu",
          description:
            'Percebi que ir "no seco" — sem estruturar bem o pedido, por preguiça de explicar o que já sabia na cabeça — encarece e complica tudo. Foi aqui que entendi de verdade o que é gestão de tokens.',
          kind: "default",
        },
        {
          label: "o poder do designer",
          description:
            "O diferencial não é saber programar: é a capacidade de visualizar mentalmente o processo inteiro e organizar o pensamento antes de conversar com a IA.",
          kind: "insight",
        },
        {
          label: "comunicação por voz",
          description:
            "Descobri que ditar por voz me ajuda a explicar ideias de forma mais completa e natural do que digitando.",
          kind: "default",
        },
      ],
      reflection:
        "O potencial da ferramenta está em como você chega e conversa com ela — não é sobre saber programar.",
    },
    {
      id: "producao-musical",
      name: "Produção Musical",
      meta: "projeto pessoal · ainda não iniciada",
      status: "nao-iniciado",
      intro:
        "Objetivo futuro: desenvolver plugins e softwares que ajudem no processo de produção e mixagem musical. Próxima estação a abrir.",
      commits: [],
    },
  ],
  trunkItems: [
    {
      label: "GESTÃO DE TOKENS E CONTEXTO",
      before: "gastar crédito sem entender por quê",
      after: "planejar o pedido antes de escrever, sabendo o que estou gastando e por quê",
    },
    {
      label: "ESCOLHA E DIVISÃO ENTRE AGENTES",
      before: "usar um agente genérico para tudo",
      after: "entender quando vale separar tarefas entre agentes especializados",
    },
    {
      label: "ORGANIZAÇÃO DE PROJETO",
      before: "pastas improvisadas, herdadas de um curso",
      after: "estrutura pensada para o que cada projeto realmente precisa",
    },
  ],
  sources: [
    {
      label: "Udemy — Claude Code do zero ao avançado",
      href: "https://www.udemy.com/course/claude-code-do-zero-ao-avancado/",
    },
    { label: "EliteDaIA", href: "https://elitedaia.com.br" },
  ],
});
