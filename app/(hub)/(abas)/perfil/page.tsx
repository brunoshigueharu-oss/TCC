import type { Metadata } from "next";

import { AiUsageSection } from "./_components/ai-usage-section";
import { BadgesSection } from "./_components/badges-section";
import { CommunitySection } from "./_components/community-section";
import { ProfileHeader } from "./_components/profile-header";
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
  const [{ person, profile, track, weeklyRank, unreadNotifications }, aiUsage] = await Promise.all([
    getMyProfile(),
    getAiUsage(parseAiUsageTab(readParam(query.ia))),
  ]);

  return (
    <>
      <ProfileHeader
        person={person}
        nextLevelXp={profile.nextLevelXp}
        weeklyRank={weeklyRank}
        unreadNotifications={unreadNotifications}
      />
      <main className="flex flex-col gap-7 pt-6 pb-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6 lg:gap-y-8 lg:pt-8 lg:pb-0">
        <TrackProgressSection track={track} />
        <BadgesSection badges={person.badges} lockedBadges={profile.lockedBadges} />
        <WeekSection week={profile.week} streakDays={profile.streakDays} />
        <AiUsageSection data={aiUsage} />
        <CommunitySection community={profile.community} username={person.username} />
      </main>
    </>
  );
}
