import { useState } from "react";
import type { UserProfileExtended } from "@/types/profile.interface";
import { FriendsModal } from "./friendsModal/FriendsModal";
import styles from "./ProfileHero.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  profile: UserProfileExtended;
}

export const ProfileHero = ({ profile }: Props) => {
  const { t } = useTranslation();
  const [rankMode, setRankMode] = useState<"perfect" | "total">("perfect");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allFriends =
    rankMode === "perfect"
      ? profile.friends_perfect
      : profile.friends_achievements;

  const previewFriends = allFriends.slice(0, 2);

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.userInfoCard}>
          <img
            src={profile.avatar}
            alt={profile.name}
            className={styles.bigAvatar}
          />
          <div className={styles.userDetails}>
            <h1 className={styles.userName}>{profile.name}</h1>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t("profile.games")}</span>
                <span className={styles.statValue}>{profile.game_count}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>
                  {t("profile.completed")}
                </span>
                <span className={styles.statValue}>
                  {profile.completed_count}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>
                  {t("profile.achievements")}
                </span>
                <span className={styles.statValue}>
                  {profile.achievement_count}
                </span>
              </div>
            </div>
            <div className={styles.globalRanks}>
              <div className={styles.rankBadge}>
                {t("profile.rank_perfect")}:{" "}
                <strong>#{profile.rank_perfect || "N/A"}</strong>
              </div>
              <div className={styles.rankBadge}>
                {t("profile.rank_achievements")}:{" "}
                <strong>#{profile.rank_achievements || "N/A"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.friendsCard}>
          <div className={styles.friendsHeader}>
            <h3 className={styles.cardTitle}>{t("profile.friend_rating")}</h3>
            <div className={styles.toggleContainer}>
              <button
                className={`${styles.toggleBtn} ${
                  rankMode === "perfect" ? styles.activeToggle : ""
                }`}
                onClick={() => setRankMode("perfect")}
              >
                💎
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  rankMode === "total" ? styles.activeToggle : ""
                }`}
                onClick={() => setRankMode("total")}
              >
                🏆
              </button>
            </div>
          </div>

          <div className={styles.friendsListStatic}>
            {previewFriends.map((f) => (
              <div
                key={f.id}
                className={`${styles.friendRow} ${
                  f.user.id === profile.id ? styles.meRow : ""
                }`}
              >
                <span className={styles.rankNumber}>#{f.rank}</span>
                <img
                  src={f.user.avatar}
                  alt=""
                  className={styles.friendAvatar}
                />
                <span className={styles.friendName}>
                  {f.user.name}
                  {f.user.id === profile.id && (
                    <span className={styles.youTag}>{t("profile.you")}</span>
                  )}
                </span>
                <span className={styles.friendScore}>{f.value}</span>
              </div>
            ))}

            {previewFriends.length < 2 && (
              <div className={styles.emptyFriendRow}></div>
            )}
          </div>

          <button
            className={styles.moreBtn}
            onClick={() => setIsModalOpen(true)}
          >
            {t("profile.view_full")}
          </button>
        </div>
      </section>

      <FriendsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        friends={allFriends}
        mode={rankMode}
      />
    </>
  );
};
