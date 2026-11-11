"use client";

import Link from "next/link";

import type { PostTeaser } from "@/lib/data/comunidade";
import { useSavedIds } from "../_lib/reactions-store";

type SavedPostsProps = {
  posts: PostTeaser[];
};

/** Posts salvos pela pessoa (estado do navegador), na coluna lateral. */
export function SavedPosts({ posts }: SavedPostsProps) {
  const savedIds = useSavedIds();
  const saved = posts.filter((post) => savedIds.includes(post.id));

  if (saved.length === 0) {
    return (
      <p className="py-4 text-sm leading-relaxed text-texto-secundario">
        Use o marcador de um post para guardar e ler depois. Ele aparece aqui.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-linha">
      {saved.map((post) => (
        <li key={post.id}>
          <Link
            href={`/comunidade/posts/${post.id}`}
            className="block rounded-sm py-3 text-[15px] leading-snug font-medium outline-none hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-texto"
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
