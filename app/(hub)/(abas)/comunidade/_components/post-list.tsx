import type { PostSummary } from "@/lib/data/comunidade";
import { PostCard } from "./post-card";

type PostListProps = {
  posts: PostSummary[];
  /** Texto quando a lista está vazia. */
  emptyMessage: string;
};

/** Lista de cartões de post, com estado vazio. */
export function PostList({ posts, emptyMessage }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="mx-4 rounded-2xl lg:mx-0 bg-fundo p-4 text-sm text-texto-secundario ring-1 ring-linha/70">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
