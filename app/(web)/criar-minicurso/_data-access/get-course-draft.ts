import "server-only";

import {
  courseDraft,
  getPublishChecklist,
  isLessonReady,
  type CourseDraft,
  type DraftLesson,
  type PublishCheck,
} from "@/lib/data/criar-minicurso";

/** Valor de `?aula=` que abre uma aula nova, vazia. */
export const NEW_LESSON_PARAM = "nova";

export type CourseEditorData = {
  course: CourseDraft;
  /** Aula em edição — existente ou uma nova, vazia. */
  lesson: DraftLesson;
  /** Posição da aula (1 = primeira). */
  lessonNumber: number;
  isNewLesson: boolean;
  totalMinutes: number;
  checklist: PublishCheck[];
};

function emptyLesson(number: number): DraftLesson {
  return {
    id: `nova-${number}`,
    title: "",
    description: "",
    content: "",
    minutes: 5,
    hasVideo: false,
    materials: [],
  };
}

/**
 * Busca o rascunho e a aula aberta (`?aula=N`). Sem parâmetro válido, abre a
 * primeira aula sem conteúdo — ou a primeira, se todas estiverem prontas.
 */
export async function getCourseEditorData(rawLesson: unknown): Promise<CourseEditorData> {
  const course = courseDraft;
  const total = course.lessons.length;
  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  const checklist = getPublishChecklist(course);

  if (rawLesson === NEW_LESSON_PARAM) {
    return {
      course,
      lesson: emptyLesson(total + 1),
      lessonNumber: total + 1,
      isNewLesson: true,
      totalMinutes,
      checklist,
    };
  }

  const requested = Number(rawLesson);
  const firstPending = course.lessons.findIndex((lesson) => !isLessonReady(lesson));
  const index =
    Number.isInteger(requested) && requested >= 1 && requested <= total
      ? requested - 1
      : Math.max(firstPending, 0);

  return {
    course,
    lesson: course.lessons[index],
    lessonNumber: index + 1,
    isNewLesson: false,
    totalMinutes,
    checklist,
  };
}
