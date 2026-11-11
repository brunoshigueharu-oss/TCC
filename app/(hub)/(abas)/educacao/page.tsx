import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { EducationTabs } from "./_components/education-tabs";
import { LessonMap } from "./_components/lesson-map";
import { ModuleOverview } from "./_components/module-overview";
import { TrackIndex } from "./_components/track-index";
import { getTrack } from "./_data-access/get-track";

export const metadata: Metadata = { title: "Trilha" };

/** Aba Educação abre na Trilha (Figma: "Trilha"). */
export default async function TrackPage() {
  const track = await getTrack();
  // O protótipo mostra só o módulo em que a pessoa está.
  const [currentModule] = track.modules;
  const currentLesson = currentModule.lessons.find((lesson) => lesson.status === "em-andamento") ?? null;

  return (
    <>
      <PageHeader title={track.title} subtitle={track.subtitle} tone="trilha" eyebrow="Educação">
        <EducationTabs active="trilha" />
      </PageHeader>
      {/* Computador: módulo e mapa à esquerda; índice da trilha à direita. */}
      <main className="flex flex-col gap-12 pt-8 pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-x-16 lg:pt-12 lg:pb-0">
        <div className="flex flex-col gap-12">
          <ModuleOverview trackModule={currentModule} currentLesson={currentLesson} />
          <LessonMap trackModule={currentModule} />
        </div>
        <div className="lg:sticky lg:top-8">
          <TrackIndex track={track} currentModuleNumber={currentModule.number} />
        </div>
      </main>
    </>
  );
}
