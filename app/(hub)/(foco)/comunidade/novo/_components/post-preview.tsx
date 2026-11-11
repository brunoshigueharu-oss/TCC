import { CodeBlock } from "@/app/(hub)/(abas)/comunidade/_components/code-block";
import { PersonAvatar } from "@/app/(hub)/(abas)/comunidade/_components/person-avatar";
import { PostStatus } from "@/app/(hub)/(abas)/comunidade/_components/post-status";
import type { PostType } from "@/lib/data/comunidade";

type PostPreviewProps = {
  type: PostType;
  title: string;
  body: string;
  prompt: string;
  tags: string[];
  authorName: string;
};

/** Prévia: o post como a turma vai ver, com o mesmo desenho da página do post. */
export function PostPreview({ type, title, body, prompt, tags, authorName }: PostPreviewProps) {
  const isEmpty = !title.trim() && !body.trim();

  if (isEmpty) {
    return (
      <p className="py-16 font-display text-[22px] leading-snug font-medium tracking-[-0.02em] text-texto-secundario">
        Escreva o título e o texto para ver a prévia.
      </p>
    );
  }

  return (
    <article aria-label="Prévia do post" className="flex flex-col gap-6">
      <PostStatus type={type} isSolved={false} answersCount={0} />
      <h2 className="font-display text-[30px] leading-[1.04] font-medium tracking-[-0.04em] text-balance lg:text-[44px]">
        {title || "Sem título"}
      </h2>
      <div className="flex items-center gap-2.5">
        <PersonAvatar name={authorName} size="md" />
        <span className="flex flex-col">
          <span className="text-sm font-semibold">{authorName}</span>
          <span className="font-mono text-[11px] text-texto-secundario">agora</span>
        </span>
      </div>
      <p className="text-base leading-[1.65] whitespace-pre-line lg:text-[17px]">{body}</p>
      {prompt.trim() ? <CodeBlock snippet={{ kind: "prompt", label: "prompt que usei", content: prompt.trim() }} /> : null}
      {tags.length > 0 ? (
        <p className="flex flex-wrap gap-x-4 font-mono text-[13px] text-texto-secundario">
          {tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      ) : null}
    </article>
  );
}
