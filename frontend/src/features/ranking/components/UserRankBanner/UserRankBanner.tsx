import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/context/useAuthContext";
import styles from "./UserRankBanner.module.css";

interface RankData {
  rank_achievement: number;
  rank_completed: number;
}

export const UserRankBanner = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: ranks, isLoading } = useQuery({
    queryKey: ["userRank", user?.id],
    queryFn: async () => {
      const response = await apiClient.get<RankData>(
        `/leaderboard/user/${user?.id}`
      );
      return response.data;
    },
    enabled: !!isAuthenticated && !!user?.id,
  });

  if (!isAuthenticated || !user) return null;

  if (isLoading)
    return <div className={styles.loadingStub}>Loading your rank...</div>;

  if (!ranks) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.profileSection}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <div className={styles.userInfo}>
          <span className={styles.label}>Your Profile</span>
          <span className={styles.username}>{user.name}</span>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Completionist Rank</span>
          </div>
          <div className={styles.statData}>
            <span className={styles.rankValue}>#{ranks.rank_completed}</span>
            <span className={styles.realValue}>
              ({user.completed_count} games)
            </span>
          </div>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.statBox}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Hunter Rank</span>
          </div>
          <div className={styles.statData}>
            <span className={styles.rankValue}>#{ranks.rank_achievement}</span>
            <span className={styles.realValue}>
              ({user.achievement_count} achvs)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
