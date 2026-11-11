import "server-only";

import {
  listLessonOptions,
  listPostTeasers,
  listTags,
  type CommunityTag,
  type LessonOption,
  type PostTeaser,
} from "@/lib/data/comunidade";

export type NewPostOptions = {
  tags: CommunityTag[];
  lessons: LessonOption[];
  /** Posts existentes, para sugerir dúvidas parecidas enquanto a pessoa escreve. */
  teasers: PostTeaser[];
};

/** Opções do editor de novo post: tags, lições que podem ser ligadas e posts existentes. */
export async function getNewPostOptions(): Promise<NewPostOptions> {
  return { tags: listTags(), lessons: listLessonOptions(), teasers: listPostTeasers() };
}
