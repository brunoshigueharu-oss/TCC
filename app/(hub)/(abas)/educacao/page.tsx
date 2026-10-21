import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { CurrentModuleCard } from "./_components/current-module-card";
import { EducationTabs } from "./_components/education-tabs";
import { LessonMap } from "./_components/lesson-map";
import { SkipModuleCard } from "./_components/skip-module-card";
import { getTrack } from "./_data-access/get-track";

export const metadata: Metadata = { title: "Trilha" };

/** Aba Educação abre na Trilha (Figma: "Trilha"). */
export default async function TrackPage() {
  const track = await getTrack();
  // O protótipo mostra só o módulo em que a pessoa está.
  const [currentModule] = track.modules;

  return (
    <>
      <PageHeader title={track.title} subtitle={track.subtitle} icon={BookOpen} tone="trilha">
        <EducationTabs active="trilha" />
      </PageHeader>
      <main className="flex flex-col gap-7 pt-6 pb-8">
        <CurrentModuleCard trackModule={currentModule} />
        <LessonMap trackModule={currentModule} />
        <SkipModuleCard nextModuleNumber={currentModule.number + 1} />
      </main>
    </>
  );
}
