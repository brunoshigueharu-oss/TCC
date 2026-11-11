import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { SectionHeading } from "@/components/section-heading";
import { PostList } from "../../_components/post-list";
import { PersonAnswers } from "./_components/person-answers";
import { PersonBadges } from "./_components/person-badges";
import { PersonCourses } from "./_components/person-courses";
import { PersonSummary } from "./_components/person-summary";
import { getPerson } from "./_data-access/get-person";

export async function generateMetadata({
  params,
}: PageProps<"/comunidade/pessoas/[usuario]">): Promise<Metadata> {
  const { usuario } = await params;
  const found = await getPerson(usuario);
  return { title: found ? found.person.name : "Perfil" };
}

/** Perfil público de uma pessoa da comunidade, no mesmo padrão editorial do feed. */
export default async function PublicProfilePage({
  params,
}: PageProps<"/comunidade/pessoas/[usuario]">) {
  const { usuario } = await params;
  const found = await getPerson(usuario);
  if (!found) notFound();

  const { person, isCurrentUser, posts, answers } = found;
  const [firstName] = person.name.split(" ");

  return (
    <div className="flex flex-1 flex-col">
      <BackBar href="/comunidade" label="Comunidade" />
      <PersonSummary
        person={person}
        isCurrentUser={isCurrentUser}
        postsCount={posts.length}
        acceptedCount={answers.filter((answer) => answer.isHelpful).length}
      />
      <main className="flex flex-col gap-10 pt-8 pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12 lg:pb-0">
        <div className="flex min-w-0 flex-col gap-10">
          <section aria-labelledby="posts-pessoa" className="flex flex-col">
            <SectionHeading
              id="posts-pessoa"
              title="Posts"
              tone="comunidade"
              meta={String(posts.length).padStart(2, "0")}
            />
            <PostList
              posts={posts}
              isAuthorHidden
              hasEmptyAction={false}
              emptyMessage={`${firstName} ainda não publicou na comunidade.`}
            />
          </section>
          <PersonAnswers firstName={firstName} answers={answers} />
        </div>
        <div className="flex flex-col gap-10 lg:sticky lg:top-24">
          <PersonBadges firstName={firstName} badges={person.badges} />
          <PersonCourses courses={person.courses} />
        </div>
      </main>
    </div>
  );
}
