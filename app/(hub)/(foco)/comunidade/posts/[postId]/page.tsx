import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { SurfaceCard } from "@/components/surface-card";
import { AnswerList } from "./_components/answer-list";
import { PostContent } from "./_components/post-content";
import { PostMenu } from "./_components/post-menu";
import { ReplyForm } from "./_components/reply-form";
import { ReportSheet } from "./_components/report-sheet";
import { getPost } from "./_data-access/get-post";

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

export async function generateMetadata({
  params,
}: PageProps<"/comunidade/posts/[postId]">): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);
  return { title: post ? post.title : "Post" };
}

/**
 * Post da Comunidade (Figma: "Post"). `?denunciar=1` abre a folha de denúncia
 * por cima; `?denunciado=1` mostra a confirmação depois do envio.
 */
export default async function PostPage({
  params,
  searchParams,
}: PageProps<"/comunidade/posts/[postId]">) {
  const { postId } = await params;
  const post = await getPost(postId);
  if (!post) notFound();

  const query = await searchParams;
  const isReportOpen = readParam(query.denunciar) === "1";
  const isJustReported = readParam(query.denunciado) === "1";

  return (
    <>
      <BackBar href="/comunidade" label="Comunidade" action={<PostMenu postId={post.id} />} />
      <main className="flex flex-1 flex-col gap-7 pt-5 pb-8 lg:px-8 lg:pt-8">
        {isJustReported ? (
          <SurfaceCard role="status" className="flex items-start gap-3 p-4">
            <CircleCheck aria-hidden className="size-5 shrink-0 text-acao" strokeWidth={2} />
            <p className="text-sm leading-[1.45]">
              Denúncia enviada. A moderação analisa em até 24 h e você recebe um aviso com a decisão.
            </p>
          </SurfaceCard>
        ) : null}
        <PostContent post={post} />
        <AnswerList answers={post.answers} />
      </main>
      <ReplyForm postId={post.id} />
      {isReportOpen ? <ReportSheet postId={post.id} /> : null}
    </>
  );
}
