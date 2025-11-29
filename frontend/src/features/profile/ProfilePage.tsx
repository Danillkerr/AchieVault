import { useParams } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "@/context/useAuthContext";
import { ScreenLoader } from "@/components/feedback/ScreenLoader/ScreenLoader";
import { ProfileHero } from "./components/profileHero/ProfileHero";
import { RoadmapBanner } from "./components/roadmapBanner/RoadmapBanner";
import { RecentGames } from "./components/recentGames/RecentGames";
import { ProfileSettings } from "@/features/profile/components/settings/ProfileSettings";
import styles from "./ProfilePage.module.css";
import { useTranslation } from "react-i18next";

export const ProfilePage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const targetUserId = id ? id : user?.id?.toString();
  const isOwnProfile = user && targetUserId === user.id.toString();

  const { profile, isLoading } = useProfileData(targetUserId);

  if (isLoading) return <ScreenLoader text={t("loading.profile")} />;
  if (!profile)
    return <div className={styles.error}>{t("profile.not_found")}</div>;

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <ProfileHero profile={profile} />

        <RoadmapBanner roadmap={profile.active_roadmap} />

        <RecentGames games={profile.recent_games} />

        {isOwnProfile && <ProfileSettings />}
      </div>
    </div>
  );
};
