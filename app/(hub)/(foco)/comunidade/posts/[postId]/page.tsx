import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { Discussion } from "./_components/discussion";
import { DiscussionSummary } from "./_components/discussion-summary";
import { PostArticle } from "./_components/post-article";
import { PostMenu } from "./_components/post-menu";
import { RelatedPosts } from "./_components/related-posts";
import { ReportSheet } from "./_components/report-sheet";
import { getPost } from "./_data-access/get-post";

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

export async function generateMetadata({ params }: PageProps<"/comunidade/posts/[postId]">): Promise<Metadata> {
  const { postId } = await params;
  const data = await getPost(postId);
  return { title: data ? data.post.title : "Post" };
}

/**
 * Post da Comunidade: o post, o resumo da discussão, as respostas (aceita no
 * topo) e as dúvidas parecidas. `?denunciar=1` abre a folha de denúncia;
 * `?denunciado=1` mostra a confirmação depois do envio.
 */
export default async function PostPage({ params, searchParams }: PageProps<"/comunidade/posts/[postId]">) {
  const { postId } = await params;
  const data = await getPost(postId);
  if (!data) notFound();

  const { post, related, currentPerson } = data;
  const query = await searchParams;
  const isReportOpen = readParam(query.denunciar) === "1";
  const isJustReported = readParam(query.denunciado) === "1";

  return (
    <div className="flex flex-1 flex-col bg-fundo">
      <BackBar href="/comunidade" label="Comunidade" action={<PostMenu postId={post.id} />} />
      <main className="flex flex-1 flex-col gap-10 px-4 pt-8 lg:px-10 lg:pt-12">
        {isJustReported ? (
          <p role="status" className="flex items-start gap-3 border-b border-linha pb-4 text-sm leading-relaxed">
            <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-acao" strokeWidth={2} />
            Denúncia enviada. A moderação analisa em até 24 h e você recebe um aviso com a decisão.
          </p>
        ) : null}

        <PostArticle post={post} />

        {post.summary && post.summary.length > 0 ? (
          <DiscussionSummary points={post.summary} answersCount={post.answersCount} />
        ) : null}

        <Discussion postId={post.id} answers={post.answers} currentPerson={currentPerson} />

        <div className="pb-12">
          <RelatedPosts posts={related} />
        </div>
      </main>
      {isReportOpen ? <ReportSheet postId={post.id} /> : null}
    </div>
  );
}
