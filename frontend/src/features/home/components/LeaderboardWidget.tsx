import { BaseWidget } from "../../../components/widgets/BaseWidget";
import styles from "./Widgets.module.css";
import type {
  LeaderboardUsers,
  LeaderboardUser,
} from "../../../types/user.interface";

interface Props {
  title: string;
  users?: LeaderboardUsers;
  metric: "perfect" | "total";
}

export const LeaderboardWidget = ({ title, users, metric }: Props) => {
  const renderMetric = (user: LeaderboardUser) => {
    if (metric === "perfect") {
      return <span>{user.user.completed_count}</span>;
    }
    return <span>{user.user.achievement_count}</span>;
  };

  if (!users) {
    return null;
  }

  return (
    <BaseWidget title={title}>
      <div className={styles.tableHeader}>
        <span className={styles.colRank}>#</span>
        <span className={styles.colUser}>User</span>
        <span className={styles.colStat}>
          {metric === "perfect" ? "100%" : "Total"}
        </span>
      </div>

      <div className={styles.list}>
        {users.data.map((user, index) => (
          <div key={user.id} className={styles.row}>
            <span
              className={`${styles.rank} ${index < 3 ? styles.topRank : ""}`}
            >
              {index + 1}
            </span>

            <div className={styles.userInfo}>
              <img
                src={user.user.avatar}
                alt={user.user.name}
                className={styles.userAvatar}
              />
              <span className={styles.username}>{user.user.name}</span>
            </div>

            <div className={styles.statValue}>{renderMetric(user)}</div>
          </div>
        ))}
      </div>
    </BaseWidget>
  );
};
