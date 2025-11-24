import type { UserRoadmap } from "../../../../types/profile.interface";
import { Link } from "react-router-dom";
import styles from "./RoadmapBanner.module.css";

interface Props {
  roadmap?: UserRoadmap | null;
}

export const RoadmapBanner = ({ roadmap }: Props) => {
  if (!roadmap) {
    return (
      <Link
        to="/roadmaps/create"
        className={`${styles.roadmapContainer} ${styles.emptyRoadmap}`}
      >
        <div className={styles.emptyContent}>
          <h3>Start Your Journey</h3>
          <p>Create a roadmap to track your backlog and completion goals.</p>
          <span className={styles.createFakeBtn}>+ Create Roadmap</span>
        </div>
      </Link>
    );
  }

  const coverUrl =
    "https://images.igdb.com/igdb/image/upload/t_1080p/" +
    roadmap.recommended_game?.cover +
    ".jpg";

  return (
    <Link to={`/roadmaps/${roadmap.id}`} className={styles.roadmapContainer}>
      <div className={styles.roadmapLeft}>
        <img
          src={coverUrl}
          alt="Roadmap Game"
          className={styles.roadmapCover}
        />
        <div className={styles.roadmapInfo}>
          <h2 className={styles.roadmapTitle}>{roadmap.title}</h2>

          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${roadmap.progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {roadmap.progress}% ({roadmap.completed_games}/
              {roadmap.total_games})
            </span>
          </div>
        </div>
      </div>

      <div className={styles.roadmapStats}>
        <div className={styles.rStat}>
          <span className={styles.rsLabel}>ETC Time</span>
          <span className={styles.rsValue}>~{roadmap.estimated_time} hrs.</span>
        </div>
        <div className={styles.rStat}>
          <span className={styles.rsLabel}>Games</span>
          <span className={styles.rsValue}>{roadmap.total_games}</span>
        </div>
      </div>

      <div className={styles.roadmapRight}>
        {roadmap.recommended_game && (
          <div className={styles.recommendBox}>
            <span className={styles.recLabel}>Next Recommended:</span>
            <span className={styles.recGameName}>
              {roadmap.recommended_game.title}
            </span>
          </div>
        )}

        <div className={styles.miniStatus}>
          <span>In progress: {roadmap.in_progress}</span>
          <span>Abandoned: {roadmap.abandoned}</span>
        </div>
      </div>
    </Link>
  );
};
