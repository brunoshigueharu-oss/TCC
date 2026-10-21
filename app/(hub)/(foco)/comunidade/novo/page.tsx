import type { Metadata } from "next";

import { BackBar } from "@/components/back-bar";
import { NewPostForm } from "./_components/new-post-form";
import { getNewPostOptions } from "./_data-access/get-new-post-options";

export const metadata: Metadata = { title: "Novo post" };

/** Criar post (Figma: "Criar post"). Sem barra inferior; rodapé fixo "Publicar". */
export default async function NewPostPage() {
  const { tags, lessons } = await getNewPostOptions();

  return (
    <>
      <BackBar href="/comunidade" label="Novo post" />
      <NewPostForm
        tagOptions={tags.map((tag) => ({ slug: tag.slug, label: tag.label }))}
        lessonOptions={lessons}
      />
    </>
  );
}
