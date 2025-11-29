import { AchievementItem } from "../achievementItem/AchievementItem";
import type { AchievementWithStatus } from "@/types/game.interface";
import styles from "./AchievementsList.module.css";

interface Props {
  items: AchievementWithStatus[];
  emptyMessage?: string;
}

export const AchievementsList = ({
  items,
  emptyMessage = "No achievements found.",
}: Props) => {
  if (items.length === 0) {
    return <div className={styles.completedMsg}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.achievementsGrid}>
      {items.map((ach) => (
        <AchievementItem key={ach.displayName} item={ach} />
      ))}
    </div>
  );
};
