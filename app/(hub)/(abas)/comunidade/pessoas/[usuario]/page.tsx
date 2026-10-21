import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackBar } from "@/components/back-bar";
import { PersonBadges } from "./_components/person-badges";
import { PersonCourses } from "./_components/person-courses";
import { PersonPosts } from "./_components/person-posts";
import { PersonSummary } from "./_components/person-summary";
import { getPerson } from "./_data-access/get-person";

export async function generateMetadata({
  params,
}: PageProps<"/comunidade/pessoas/[usuario]">): Promise<Metadata> {
  const { usuario } = await params;
  const found = await getPerson(usuario);
  return { title: found ? found.person.name : "Perfil" };
}

/** Perfil público de uma pessoa da comunidade (Figma: "Perfil público"). */
export default async function PublicProfilePage({
  params,
}: PageProps<"/comunidade/pessoas/[usuario]">) {
  const { usuario } = await params;
  const found = await getPerson(usuario);
  if (!found) notFound();

  const { person, isCurrentUser } = found;
  const [firstName] = person.name.split(" ");

  return (
    <>
      <BackBar href="/comunidade" label="Comunidade · Perfil" />
      <main className="flex flex-col gap-7 pt-5 pb-8">
        <PersonSummary person={person} isCurrentUser={isCurrentUser} />
        <PersonBadges firstName={firstName} badges={person.badges} />
        <PersonPosts firstName={firstName} posts={person.posts} />
        <PersonCourses courses={person.courses} />
      </main>
    </>
  );
}
