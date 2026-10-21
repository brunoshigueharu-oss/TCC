import type { Metadata } from "next";

import { HomeHero } from "./_components/home-hero";
import { LessonCarousel } from "./_components/lesson-carousel";
import { OpenQuestions } from "./_components/open-questions";
import { WeeklyStats } from "./_components/weekly-stats";
import { getHomeData } from "./_data-access/get-home-data";

export const metadata: Metadata = { title: "Início" };

export default async function HomePage() {
  const { user, currentLesson, dailyGoal, weeklyXp, openQuestions, unreadNotifications } =
    await getHomeData();

  return (
    <div className="flex flex-1 flex-col bg-superficie">
      <HomeHero
        firstName={user.firstName}
        level={user.level}
        xp={user.xp}
        unreadNotifications={unreadNotifications}
      />
      <main className="flex flex-col gap-7 pt-7 pb-8">
        {currentLesson ? <LessonCarousel current={currentLesson} /> : null}
        <WeeklyStats dailyGoal={dailyGoal} weeklyXp={weeklyXp} />
        <OpenQuestions questions={openQuestions} />
      </main>
    </div>
  );
}
