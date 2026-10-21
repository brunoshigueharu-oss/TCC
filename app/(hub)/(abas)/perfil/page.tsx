import type { Metadata } from "next";

import { BadgesSection } from "./_components/badges-section";
import { CommunitySection } from "./_components/community-section";
import { ProfileHeader } from "./_components/profile-header";
import { TrackProgressSection } from "./_components/track-progress-section";
import { WeekSection } from "./_components/week-section";
import { getMyProfile } from "./_data-access/get-my-profile";

export const metadata: Metadata = { title: "Meu perfil" };

/** Aba Perfil (Figma: "Meu perfil"). */
export default async function ProfilePage() {
  const { person, profile, track, weeklyRank } = await getMyProfile();

  return (
    <>
      <ProfileHeader person={person} nextLevelXp={profile.nextLevelXp} weeklyRank={weeklyRank} />
      <main className="flex flex-col gap-7 pt-6 pb-8">
        <TrackProgressSection track={track} />
        <BadgesSection badges={person.badges} lockedBadges={profile.lockedBadges} />
        <WeekSection week={profile.week} streakDays={profile.streakDays} />
        <CommunitySection community={profile.community} username={person.username} />
      </main>
    </>
  );
}
