import "server-only";

import { listLessonOptions, listTags, type CommunityTag, type LessonOption } from "@/lib/data/comunidade";

export type NewPostOptions = {
  tags: CommunityTag[];
  lessons: LessonOption[];
};

/** Opções do formulário de novo post: tags e lições que podem ser ligadas. */
export async function getNewPostOptions(): Promise<NewPostOptions> {
  return { tags: listTags(), lessons: listLessonOptions() };
}
