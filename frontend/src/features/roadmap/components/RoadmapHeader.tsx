import type { Roadmap } from "../../../types/roadmap.interface";
import styles from "./RoadmapComponents.module.css";

interface Props {
  roadmap: Roadmap;
}

export const RoadmapHeader = ({ roadmap }: Props) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerTop}>
        <h1 className={styles.roadmapTitle}>{roadmap.title}</h1>

        <div className={styles.headerBadges}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Est. Time</span>
            <span className={styles.statValue}>
              ~{(roadmap.total_etc / 60 / 60).toFixed(1)}h
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Total Achievs</span>
            <span className={styles.statValue}>
              {roadmap.total_achievements}
            </span>
          </div>
        </div>
      </div>

      <h3 className={styles.recTitle}>Next Recommended:</h3>

      {roadmap.recommended_game && (
        <div className={styles.recCard}>
          <div className={styles.recCoverWrapper}>
            <img
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${roadmap.recommended_game.cover}.jpg`}
              className={styles.recCover}
              alt=""
            />
          </div>
          <div className={styles.recInfo}>
            <h2 className={styles.recGameTitle}>
              {roadmap.recommended_game.title}
            </h2>

            <div className={styles.recStats}>
              <div className={styles.recStatItem}>
                <strong>
                  {(roadmap.recommended_game.playtime / 60).toFixed(1)}h
                </strong>
                <span>Played</span>
              </div>
              <div className={styles.recStatItem}>
                <strong>
                  {roadmap.recommended_game.achievements_unlocked}/
                  {roadmap.recommended_game.achievements_total}
                </strong>
                <span>Achievs</span>
              </div>
              <div className={styles.recStatItem}>
                <strong>{roadmap.recommended_game.completion_percent}%</strong>
                <span>Done</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
