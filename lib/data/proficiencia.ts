import { z } from "zod";

/**
 * Dados FICTÍCIOS do teste de proficiência. Na versão real as questões são
 * sorteadas de um banco maior e a correção acontece só no servidor.
 */

export const optionLetters = ["A", "B", "C", "D"] as const;
export const optionLetterSchema = z.enum(optionLetters);
export type OptionLetter = z.infer<typeof optionLetterSchema>;

/**
 * Respostas da prova guardadas na URL (`?respostas=BCA-D`): uma letra por
 * questão, "-" para questão ainda sem resposta.
 */
export const answersParamSchema = z.string().regex(/^[A-D-]*$/);

const questionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()).length(optionLetters.length),
  correct: optionLetterSchema,
});

const proficiencySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  intro: z.string(),
  prerequisite: z.string(),
  minutesPerQuestion: z.number().int().positive(),
  passingPercent: z.number().int().min(1).max(100),
  badge: z.object({
    name: z.string(),
    description: z.string(),
  }),
  profileChanges: z.array(z.string()).min(1),
  questions: z.array(questionSchema).min(1),
});

export type ProficiencyQuestion = z.infer<typeof questionSchema>;
export type Proficiency = z.infer<typeof proficiencySchema>;

export const proficiency: Proficiency = proficiencySchema.parse({
  title: "Teste de proficiência",
  subtitle: "Prove o que você já sabe",
  intro:
    "Comprove que você já usa IA de código no seu trabalho de design e receba uma classificação própria no perfil. A aprovação também libera os módulos da trilha que você ainda não fez.",
  prerequisite: "Nenhum",
  minutesPerQuestion: 2,
  passingPercent: 70,
  badge: {
    name: "Selo Profissional",
    description: "Classificação separada do nível por XP. Aparece no seu perfil.",
  },
  profileChanges: [
    "O selo aparece ao lado do seu nível.",
    "Seu nível por XP continua o mesmo: o selo é uma classificação separada.",
    "Quem visita seu perfil vê a data da aprovação.",
  ],
  questions: [
    {
      text: "Ao pedir uma tela nova para a IA de código, que informação mais evita retrabalho?",
      options: [
        "Só o nome da tela",
        "O objetivo da tela, o conteúdo e os componentes que já existem",
        "Uma lista de cores preferidas",
        "O número de telas do projeto",
      ],
      correct: "B",
    },
    {
      text: "A IA entregou um card quase certo. Qual é o melhor próximo pedido?",
      options: [
        "“Refaça o card do zero.”",
        "“Melhore o card.”",
        "“Mantenha o layout e aumente o título para 18 px.”",
        "“Mude tudo o que achar necessário.”",
      ],
      correct: "C",
    },
    {
      text: "Por que pedir uma mudança de cada vez?",
      options: [
        "Porque a IA só aceita um pedido por mensagem",
        "Para saber qual mudança causou um problema no resultado",
        "Para gastar menos créditos",
        "Não faz diferença",
      ],
      correct: "B",
    },
    {
      text: "Qual restrição deixa um prompt de componente mais preciso?",
      options: [
        "“Deixe bonito.”",
        "“Use o estilo moderno.”",
        "“Largura máxima de 390 px e alvos de toque de 44 px.”",
        "“Faça como os apps famosos.”",
      ],
      correct: "C",
    },
    {
      text: "O que são design tokens no código gerado?",
      options: [
        "Senhas de acesso ao projeto",
        "Valores nomeados de cor, espaço e tipografia reutilizados nos componentes",
        "Imagens exportadas do Figma",
        "Comentários deixados pela IA",
      ],
      correct: "B",
    },
    {
      text: "Um componente perdeu o estado ao trocar de tela. O que pedir à IA?",
      options: [
        "Que explique onde o estado é guardado e proponha onde mantê-lo",
        "Que troque as cores do componente",
        "Que apague o componente",
        "Que gere uma imagem estática da tela",
      ],
      correct: "A",
    },
    {
      text: "Qual destas mensagens de erro é mais acessível?",
      options: [
        "Borda vermelha no campo, sem texto",
        "“Erro.”",
        "Ícone e texto “Digite um e-mail válido”, ligados ao campo",
        "Um alerta sonoro",
      ],
      correct: "C",
    },
    {
      text: "Antes de aceitar o código gerado, o que vale conferir primeiro?",
      options: [
        "Se a tela funciona nas larguras e estados que você pediu",
        "Quantas linhas o arquivo tem",
        "Se a IA usou a biblioteca mais nova",
        "Se o código tem comentários em inglês",
      ],
      correct: "A",
    },
    {
      text: "Como pedir que a IA respeite o grid do seu layout?",
      options: [
        "“Use um grid.”",
        "Informar colunas, margens e espaçamento entre colunas em valores concretos",
        "Enviar só o nome do grid usado no Figma",
        "Pedir que ela escolha o grid ideal",
      ],
      correct: "B",
    },
    {
      text: "Depois que o resultado ficou bom, por que pedir que a IA explique o que mudou?",
      options: [
        "Para gerar documentação para o cliente",
        "Porque é obrigatório",
        "Para entender o código e conseguir revisar os próximos ajustes",
        "Para a IA lembrar da conversa",
      ],
      correct: "C",
    },
  ],
});

export function getProficiencySummary(source: Proficiency) {
  const totalQuestions = source.questions.length;
  return {
    totalQuestions,
    totalMinutes: totalQuestions * source.minutesPerQuestion,
  };
}

/** Lista de respostas a partir do parâmetro da URL (inválido → vazia). */
export function parseAnswers(raw: string | undefined, totalQuestions: number) {
  const parsed = answersParamSchema.safeParse(raw ?? "");
  const letters = parsed.success ? parsed.data.slice(0, totalQuestions) : "";
  return Array.from({ length: totalQuestions }, (_, index) => {
    const letter = optionLetterSchema.safeParse(letters[index]);
    return letter.success ? letter.data : null;
  });
}

/** Volta as respostas para o formato da URL. */
export function serializeAnswers(answers: (OptionLetter | null)[]) {
  return answers.map((answer) => answer ?? "-").join("").replace(/-+$/, "");
}

export function scoreAnswers(source: Proficiency, answers: (OptionLetter | null)[]) {
  const correct = source.questions.filter(
    (question, index) => answers[index] === question.correct,
  ).length;
  const total = source.questions.length;
  const percent = Math.round((correct / total) * 100);
  return { correct, total, percent, isApproved: percent >= source.passingPercent };
}

/** Alternativa escolhida numa questão. Validada no formulário e na Server Action. */
export const examAnswerSchema = z.object({
  answer: optionLetterSchema.optional().refine((value) => value !== undefined, {
    message: "Escolha uma alternativa para continuar.",
  }),
});

export type ExamAnswer = z.infer<typeof examAnswerSchema>;

/**
 * Resultado de demonstração, para abrir a tela de resultado direto (sem
 * passar pela prova): acerta tudo menos as duas últimas questões.
 */
export function getDemoAnswers(source: Proficiency): (OptionLetter | null)[] {
  return source.questions.map((question, index) => {
    if (index < source.questions.length - 2) return question.correct;
    return optionLetters.find((letter) => letter !== question.correct) ?? null;
  });
}
