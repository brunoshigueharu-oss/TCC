import type { Metadata } from "next";

import { HomeHero } from "./_components/home-hero";
import { LessonCarousel } from "./_components/lesson-carousel";
import { OpenQuestions } from "./_components/open-questions";
import { WeeklyStats } from "./_components/weekly-stats";
import { getHomeData } from "./_data-access/get-home-data";

export const metadata: Metadata = { title: "Início" };

export default async function HomePage() {
  const { user, currentLesson, dailyGoal, weeklyXp, openQuestions } = await getHomeData();

  return (
    <div className="flex flex-1 flex-col bg-superficie">
      <HomeHero firstName={user.firstName} level={user.level} xp={user.xp} />
      <main className="flex flex-col gap-7 pt-7 pb-8 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-6 lg:gap-y-8 lg:pt-10 lg:pb-0">
        {currentLesson ? <LessonCarousel current={currentLesson} /> : null}
        <WeeklyStats dailyGoal={dailyGoal} weeklyXp={weeklyXp} />
        <OpenQuestions questions={openQuestions} />
      </main>
    </div>
  );
}
