import type { Metadata } from "next";

import { AchievementsTimeline } from "./_components/achievements-timeline";
import { AiUsageSection } from "./_components/ai-usage-section";
import { BadgesSection } from "./_components/badges-section";
import { CommunitySection } from "./_components/community-section";
import { ConsistencySection } from "./_components/consistency-section";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileStats } from "./_components/profile-stats";
import { TrackProgressSection } from "./_components/track-progress-section";
import { WeekSection } from "./_components/week-section";
import { getAiUsage, parseAiUsageTab } from "./_data-access/get-ai-usage";
import { getMyProfile } from "./_data-access/get-my-profile";

export const metadata: Metadata = { title: "Meu perfil" };

function readParam(raw: string | string[] | undefined) {
  return Array.isArray(raw) ? raw[0] : raw;
}

/** Aba Perfil (Figma: "Meu perfil"). A aba de "Uso das IAs" fica na URL (`?ia=`). */
export default async function ProfilePage({ searchParams }: PageProps<"/perfil">) {
  const query = await searchParams;
  const [{ person, profile, track, consistency, weeklyRank, unreadNotifications }, aiUsage] = await Promise.all([
    getMyProfile(),
    getAiUsage(parseAiUsageTab(readParam(query.ia))),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <ProfileHeader person={person} memberSince={profile.memberSince} unreadNotifications={unreadNotifications} />
      <ProfileStats
        level={person.level}
        xp={person.xp}
        nextLevelXp={profile.nextLevelXp}
        streakDays={profile.streakDays}
        longestStreakDays={profile.longestStreakDays}
        weeklyRank={weeklyRank}
      />
      <main className="flex flex-col gap-10 pt-8 pb-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 lg:gap-y-14 lg:pt-12 lg:pb-0">
        <TrackProgressSection track={track} />
        <BadgesSection badges={person.badges} lockedBadges={profile.lockedBadges} />
        <ConsistencySection weeks={profile.activity} summary={consistency} />
        <WeekSection week={profile.week} />
        <AiUsageSection data={aiUsage} />
        <AchievementsTimeline milestones={profile.milestones} />
        <CommunitySection community={profile.community} username={person.username} />
      </main>
    </div>
  );
}
