import styles from "./GameComponents.module.css";
import type { AchievementWithStatus } from "../../../types/game.interface";

interface Props {
  item: AchievementWithStatus;
}

export const AchievementItem = ({ item }: Props) => {
  const currentIcon = item.isUnlocked ? item.icon : item.iconGray;

  return (
    <div
      className={`${styles.achievementRow} ${
        !item.isUnlocked ? styles.locked : ""
      }`}
    >
      <img
        src={currentIcon}
        alt={item.displayName}
        className={styles.achievementIcon}
      />

      <div className={styles.achievementInfo}>
        <div className={styles.topRow}>
          <h4 className={styles.achievementTitle}>{item.displayName}</h4>
          {item.percent > 0 && (
            <span className={styles.percentBadge}>
              {item.percent.toFixed(1)}%
            </span>
          )}
        </div>

        <p className={styles.achievementDesc}>{item.description}</p>

        {item.isUnlocked && item.obtainedDate && (
          <span className={styles.unlockDate}>
            Unlocked: {item.obtainedDate.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
