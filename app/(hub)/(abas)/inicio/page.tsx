import type { Metadata } from "next";

import { DailyGoal } from "./_components/daily-goal";
import { HomeGreeting } from "./_components/home-greeting";
import { NextStep } from "./_components/next-step";
import { OpenQuestions } from "./_components/open-questions";
import { WeekNumbers } from "./_components/week-numbers";
import { WeekSummary } from "./_components/week-summary";
import { getHomeData } from "./_data-access/get-home-data";

export const metadata: Metadata = { title: "Início" };

/** Home: o painel editorial do dia (saudação, próximo passo, meta, semana, turma). */
export default async function HomePage() {
  const { user, today, currentLesson, dailyGoal, weeklyXp, week, openQuestions } = await getHomeData();

  return (
    <div className="flex flex-1 flex-col">
      <HomeGreeting
        firstName={user.firstName}
        weekday={today.weekday}
        dateLabel={today.dateLabel}
        lessonTitle={currentLesson?.lesson.title ?? null}
      />
      <main className="flex flex-col gap-6 pb-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:gap-y-10 lg:pb-0">
        {currentLesson ? <NextStep current={currentLesson} /> : null}
        <DailyGoal
          done={dailyGoal.done}
          initialTarget={dailyGoal.target}
          remainingLessons={currentLesson?.remainingLessons ?? 0}
          averageMinutes={currentLesson?.averageMinutes ?? 10}
          moduleNumber={currentLesson?.moduleNumber ?? null}
        />
        <WeekNumbers week={week} friendsRank={weeklyXp.friendsRank} />
        <WeekSummary week={week} />
        <OpenQuestions questions={openQuestions} />
      </main>
    </div>
  );
}
