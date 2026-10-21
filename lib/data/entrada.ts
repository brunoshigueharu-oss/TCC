import { z } from "zod";

/**
 * Dados FICTÍCIOS do fluxo de entrada (onboarding, consentimento e
 * nivelamento) para o protótipo. Na versão real, as perguntas do nivelamento
 * vêm do módulo de Trilha e as preferências são salvas no perfil.
 */

const choiceOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const onboardingStepSchema = z.object({
  id: z.string(),
  /** Rótulo curto que aparece no indicador de passos. */
  shortLabel: z.string(),
  title: z.string(),
  description: z.string(),
  options: z.array(choiceOptionSchema).min(2),
});

const consentItemSchema = z.object({
  id: z.enum(["personalizeTrack", "notifications", "emailUpdates"]),
  title: z.string(),
  description: z.string(),
  /** Estado inicial do interruptor. */
  isDefaultOn: z.boolean(),
});

const levelingOptionSchema = z.object({
  letter: z.enum(["A", "B", "C", "D"]),
  text: z.string(),
});

const levelingQuestionSchema = z.object({
  id: z.string(),
  /** Assunto da pergunta, ex.: "Fundamentos · prompt". */
  topic: z.string(),
  statement: z.string(),
  options: z.array(levelingOptionSchema).length(4),
});

const entradaSchema = z.object({
  onboardingSteps: z.array(onboardingStepSchema).min(1),
  consentItems: z.array(consentItemSchema),
  /** Resumo dos termos, aberto pelo link da tela de consentimento. */
  termsSummary: z.array(z.string()),
  levelingQuestions: z.array(levelingQuestionSchema).min(1),
});

export type ChoiceOption = z.infer<typeof choiceOptionSchema>;
export type OnboardingStep = z.infer<typeof onboardingStepSchema>;
export type ConsentItem = z.infer<typeof consentItemSchema>;
export type ConsentItemId = ConsentItem["id"];
export type LevelingOption = z.infer<typeof levelingOptionSchema>;
export type LevelingQuestion = z.infer<typeof levelingQuestionSchema>;
export type EntradaData = z.infer<typeof entradaSchema>;

export const entradaData: EntradaData = entradaSchema.parse({
  onboardingSteps: [
    {
      id: "objetivo",
      shortLabel: "Objetivo",
      title: "Qual é o seu objetivo?",
      description: "Sua resposta define a trilha inicial. Dá para mudar depois.",
      options: [
        {
          id: "prototipar",
          title: "Prototipar mais rápido",
          description: "Transformar layouts em protótipos funcionais.",
        },
        {
          id: "entregar-codigo",
          title: "Entregar interfaces em código",
          description: "Publicar telas e sites sem depender de outra pessoa.",
        },
        {
          id: "colaborar",
          title: "Colaborar melhor com devs",
          description: "Entender o código para conversar no mesmo nível.",
        },
        {
          id: "explorar",
          title: "Explorar as ferramentas",
          description: "Conhecer a IA de código no meu ritmo.",
        },
      ],
    },
    {
      id: "area",
      shortLabel: "Área de atuação",
      title: "Em que área você atua?",
      description: "Usamos a área para escolher exemplos próximos do seu trabalho.",
      options: [
        {
          id: "produto",
          title: "Design de produto",
          description: "Aplicativos, plataformas e sistemas digitais.",
        },
        {
          id: "web",
          title: "Design web",
          description: "Sites institucionais, landing pages e portfólios.",
        },
        {
          id: "grafico",
          title: "Design gráfico e marca",
          description: "Identidade visual, campanhas e peças digitais.",
        },
        {
          id: "estudante",
          title: "Ainda estou estudando",
          description: "Graduação, curso livre ou transição de carreira.",
        },
      ],
    },
    {
      id: "experiencia",
      shortLabel: "Experiência com IA",
      title: "Quanto você já usou IA de código?",
      description: "Não há resposta certa. Isso só ajusta o ponto de partida.",
      options: [
        {
          id: "nunca",
          title: "Nunca usei",
          description: "Conheço o assunto apenas de ouvir falar.",
        },
        {
          id: "testei",
          title: "Já testei algumas vezes",
          description: "Gerei uma tela ou outra, sem um método.",
        },
        {
          id: "uso-as-vezes",
          title: "Uso em alguns projetos",
          description: "Consigo gerar telas, mas travo nos ajustes.",
        },
        {
          id: "uso-sempre",
          title: "Uso no dia a dia",
          description: "Quero aprofundar e trocar experiências.",
        },
      ],
    },
  ],
  consentItems: [
    {
      id: "personalizeTrack",
      title: "Personalizar minha trilha",
      description: "Usar meu progresso para sugerir aulas e comunidades.",
      isDefaultOn: true,
    },
    {
      id: "notifications",
      title: "Notificações",
      description: "Lembretes da meta do dia e respostas aos meus posts.",
      isDefaultOn: true,
    },
    {
      id: "emailUpdates",
      title: "Comunicações por e-mail",
      description: "Novidades do hub e cursos novos da comunidade.",
      isDefaultOn: false,
    },
  ],
  termsSummary: [
    "Seus dados de conta (nome e e-mail) servem apenas para identificar você no hub.",
    "Seu progresso fica salvo para que você continue de onde parou em qualquer aparelho.",
    "Posts e respostas na comunidade são públicos para outras pessoas do hub.",
    "Você pode baixar ou excluir seus dados a qualquer momento, em Configurações.",
  ],
  levelingQuestions: [
    {
      id: "n1",
      topic: "Fundamentos · IA de código",
      statement: "O que uma IA de código faz ao receber um pedido de tela?",
      options: [
        { letter: "A", text: "Desenha a tela em um arquivo de imagem." },
        { letter: "B", text: "Escreve o código que monta a tela, a partir do seu pedido." },
        { letter: "C", text: "Publica o site automaticamente na internet." },
        { letter: "D", text: "Copia uma tela pronta de outro site." },
      ],
    },
    {
      id: "n2",
      topic: "Fundamentos · prompt",
      statement: "A tela de login gerada pela IA não mostra erro de senha. Qual prompt resolve melhor?",
      options: [
        { letter: "A", text: "Melhore a tela de login." },
        {
          letter: "B",
          text: "Mostre uma mensagem de erro abaixo do campo de senha quando o login falhar.",
        },
        { letter: "C", text: "Refaça todo o código com mais cuidado." },
        { letter: "D", text: "Deixe a tela mais completa e bonita." },
      ],
    },
    {
      id: "n3",
      topic: "Layout · grid",
      statement: "A IA gerou cartões com espaçamentos diferentes entre si. O que pedir?",
      options: [
        { letter: "A", text: "Use o mesmo espaçamento de 16px entre todos os cartões." },
        { letter: "B", text: "Arrume o layout." },
        { letter: "C", text: "Remova os cartões." },
        { letter: "D", text: "Aumente o tamanho da fonte." },
      ],
    },
    {
      id: "n4",
      topic: "Componentes · reaproveitamento",
      statement: "Você quer o mesmo botão em várias telas. Qual é o melhor caminho?",
      options: [
        { letter: "A", text: "Pedir para a IA copiar o código do botão em cada tela." },
        { letter: "B", text: "Pedir um componente de botão e usá-lo em todas as telas." },
        { letter: "C", text: "Desenhar o botão como imagem." },
        { letter: "D", text: "Criar um botão diferente para cada tela." },
      ],
    },
    {
      id: "n5",
      topic: "Estado · interação",
      statement: "Um interruptor volta a ficar desligado ao trocar de tela. O que está faltando?",
      options: [
        { letter: "A", text: "Uma cor mais forte no interruptor." },
        { letter: "B", text: "Guardar o estado do interruptor fora da tela." },
        { letter: "C", text: "Uma animação de transição." },
        { letter: "D", text: "Um ícone ao lado do interruptor." },
      ],
    },
    {
      id: "n6",
      topic: "Responsividade",
      statement: "O layout funciona no computador, mas quebra no celular. Qual pedido ajuda mais?",
      options: [
        { letter: "A", text: "Faça funcionar no celular." },
        { letter: "B", text: "Abaixo de 480px, empilhe as colunas e use margens de 16px." },
        { letter: "C", text: "Diminua tudo pela metade." },
        { letter: "D", text: "Esconda o conteúdo no celular." },
      ],
    },
    {
      id: "n7",
      topic: "Acessibilidade",
      statement: "Um botão só tem um ícone, sem texto. O que garante que ele seja compreendido?",
      options: [
        { letter: "A", text: "Deixar o ícone maior." },
        { letter: "B", text: "Trocar o ícone por outro mais conhecido." },
        { letter: "C", text: "Dar ao botão um nome acessível, lido por leitores de tela." },
        { letter: "D", text: "Usar uma cor mais chamativa." },
      ],
    },
    {
      id: "n8",
      topic: "Revisão · código gerado",
      statement: "Antes de aceitar uma mudança feita pela IA, o que você deve fazer primeiro?",
      options: [
        { letter: "A", text: "Aceitar, porque a IA sabe o que faz." },
        { letter: "B", text: "Pedir para a IA refazer do zero." },
        { letter: "C", text: "Abrir a tela e conferir se o resultado é o esperado." },
        { letter: "D", text: "Apagar a versão anterior." },
      ],
    },
  ],
});
