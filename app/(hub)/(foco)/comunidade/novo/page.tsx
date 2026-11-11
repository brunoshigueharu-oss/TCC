import type { Metadata } from "next";

import { BackBar } from "@/components/back-bar";
import { NewPostForm } from "./_components/new-post-form";
import { getNewPostOptions } from "./_data-access/get-new-post-options";

export const metadata: Metadata = { title: "Novo post" };

/** Editor de post: limpo e focado, com prévia e dúvidas parecidas. */
export default async function NewPostPage() {
  const { tags, lessons, teasers } = await getNewPostOptions();

  return (
    <div className="flex flex-1 flex-col bg-fundo">
      <BackBar href="/comunidade" label="Novo post" />
      <NewPostForm
        tagOptions={tags.map((tag) => ({ slug: tag.slug, label: tag.label }))}
        lessonOptions={lessons}
        teasers={teasers}
      />
    </div>
  );
}
