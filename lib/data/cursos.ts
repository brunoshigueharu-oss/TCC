import { z } from "zod";

/**
 * Dados FICTÍCIOS dos minicursos da comunidade para o protótipo. Na versão
 * real vêm do módulo "Cursos da comunidade" da API (cursos publicados depois
 * da moderação) com o progresso da pessoa logada.
 */

const tagSchema = z.enum(["prompts", "layout", "componentes", "estado", "acessibilidade", "ferramentas"]);

const courseLessonSchema = z.object({
  number: z.number().int().positive(),
  title: z.string(),
  minutes: z.number().int().positive(),
  summary: z.string(),
  /** Perguntas no fio "Dúvidas desta aula". */
  questionsCount: z.number().int().nonnegative(),
});

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  author: z.object({
    username: z.string(),
    name: z.string(),
    role: z.string(),
  }),
  tags: z.array(tagSchema).min(1),
  /** Composição geométrica provisória da capa (até chegarem as ilustrações). */
  cover: z.enum(["circulo", "quadrado", "arco"]),
  /** Aulas que a pessoa logada já assistiu. */
  completedLessons: z.number().int().nonnegative(),
  lessons: z.array(courseLessonSchema).min(1),
});

export type CourseTag = z.infer<typeof tagSchema>;
export type CourseLesson = z.infer<typeof courseLessonSchema>;
export type Course = z.infer<typeof courseSchema>;

/** Rótulo de cada tag nos filtros. */
export const courseTagLabels: Record<CourseTag, string> = {
  prompts: "Prompts",
  layout: "Layout",
  componentes: "Componentes",
  estado: "Estado",
  acessibilidade: "Acessibilidade",
  ferramentas: "Ferramentas",
};

export const courseTagSchema = tagSchema;

export const courses: Course[] = z.array(courseSchema).parse([
  {
    id: "figma-para-codigo",
    title: "Do Figma ao código com IA",
    description:
      "Como preparar um arquivo do Figma para que a IA de código entenda a estrutura da tela, e como revisar o que ela entrega antes de seguir.",
    author: { username: "rafael", name: "Rafael Souza", role: "Designer de produto" },
    tags: ["ferramentas", "layout"],
    cover: "quadrado",
    completedLessons: 2,
    lessons: [
      {
        number: 1,
        title: "Organizar camadas para a IA",
        minutes: 8,
        summary: "Nomes de camadas, auto layout e componentes ajudam a IA a reconhecer a hierarquia da tela.",
        questionsCount: 4,
      },
      {
        number: 2,
        title: "Exportar contexto do arquivo",
        minutes: 10,
        summary: "O que enviar junto com o pedido: medidas, tokens de cor e o comportamento esperado.",
        questionsCount: 6,
      },
      {
        number: 3,
        title: "Pedir a primeira versão da tela",
        minutes: 12,
        summary: "Um pedido em partes: estrutura primeiro, depois estilo, depois estados.",
        questionsCount: 12,
      },
      {
        number: 4,
        title: "Comparar o resultado com o layout",
        minutes: 9,
        summary: "Como apontar diferenças de espaçamento e alinhamento de forma que a IA consiga corrigir.",
        questionsCount: 3,
      },
      {
        number: 5,
        title: "Ajustar responsividade",
        minutes: 11,
        summary: "Descrever o que muda entre celular e computador sem desenhar cada tamanho.",
        questionsCount: 2,
      },
      {
        number: 6,
        title: "Revisar antes de entregar",
        minutes: 8,
        summary: "Uma lista curta de verificação para o código gerado antes de compartilhar com o time.",
        questionsCount: 0,
      },
    ],
  },
  {
    id: "tokens-com-ia",
    title: "Design tokens com IA",
    description:
      "Transformar a paleta e a tipografia do seu projeto em tokens que a IA de código usa de forma consistente em todas as telas.",
    author: { username: "ana", name: "Ana Lima", role: "Designer de sistemas" },
    tags: ["componentes", "prompts"],
    cover: "circulo",
    completedLessons: 0,
    lessons: [
      {
        number: 1,
        title: "O que são tokens",
        minutes: 7,
        summary: "Cor, tipografia e espaçamento como nomes, não como valores soltos.",
        questionsCount: 2,
      },
      {
        number: 2,
        title: "Descrever tokens no prompt",
        minutes: 9,
        summary: "Como apresentar os tokens à IA para que ela não invente cores novas.",
        questionsCount: 5,
      },
      {
        number: 3,
        title: "Tokens em componentes",
        minutes: 11,
        summary: "Aplicar tokens em botões, cartões e campos sem repetir valores.",
        questionsCount: 1,
      },
      {
        number: 4,
        title: "Manter a consistência",
        minutes: 8,
        summary: "Revisar o código gerado em busca de valores fora do sistema.",
        questionsCount: 0,
      },
    ],
  },
  {
    id: "micro-interacoes",
    title: "Micro-interações e estados",
    description:
      "Pedir à IA estados de carregamento, erro e vazio, e pequenas animações que ajudam a pessoa a entender o que aconteceu na tela.",
    author: { username: "julia", name: "Júlia Rocha", role: "Designer de interação" },
    tags: ["estado", "acessibilidade"],
    cover: "arco",
    completedLessons: 0,
    lessons: [
      {
        number: 1,
        title: "Estados que toda tela precisa",
        minutes: 8,
        summary: "Carregando, vazio, erro e sucesso: o que descrever para cada um.",
        questionsCount: 3,
      },
      {
        number: 2,
        title: "Transições com propósito",
        minutes: 9,
        summary: "Quando uma animação ajuda e quando atrapalha a leitura da tela.",
        questionsCount: 1,
      },
      {
        number: 3,
        title: "Movimento reduzido",
        minutes: 7,
        summary: "Respeitar a preferência de movimento reduzido do sistema.",
        questionsCount: 2,
      },
      {
        number: 4,
        title: "Testar os estados no navegador",
        minutes: 10,
        summary: "Como forçar cada estado para revisar o resultado da IA.",
        questionsCount: 0,
      },
      {
        number: 5,
        title: "Documentar para o time",
        minutes: 6,
        summary: "Registrar os estados criados para quem continuar o projeto.",
        questionsCount: 0,
      },
    ],
  },
]);

/** Soma dos minutos das aulas. */
export function getCourseMinutes(course: Course) {
  return course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}

/** 42 → "42 min", 70 → "1 h 10 min" */
export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

/** 1 → "1 aula", 5 → "5 aulas" */
export function formatLessonsCount(count: number) {
  return count === 1 ? "1 aula" : `${count} aulas`;
}
