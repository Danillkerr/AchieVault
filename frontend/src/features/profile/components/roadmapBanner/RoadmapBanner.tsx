import { Link } from "react-router-dom";
import styles from "./RoadmapBanner.module.css";
import type { UserRoadmap } from "@/types/profile.interface";

interface Props {
  roadmap?: UserRoadmap | null;
}

export const RoadmapBanner = ({ roadmap }: Props) => {
  if (!roadmap) {
    return (
      <Link
        to="/profile/create-roadmap"
        className={`${styles.roadmapContainer} ${styles.emptyState}`}
      >
        <div className={styles.emptyContent}>
          <div className={styles.emptyText}>
            <h3>Start Your Journey</h3>
            <p>Create a roadmap to track your backlog and completion goals.</p>
          </div>
          <span className={styles.createFakeBtn}>+ Create Roadmap</span>
        </div>
      </Link>
    );
  }

  const coverUrl = roadmap.recommended_game?.cover
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${roadmap.recommended_game.cover}.jpg`
    : "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png";

  return (
    <Link
      to={`/profile/roadmap/${roadmap.id}`}
      className={styles.roadmapContainer}
    >
      <div className={styles.mainSection}>
        <div className={styles.coverWrapper}>
          <img
            src={coverUrl}
            alt="Roadmap Game"
            className={styles.roadmapCover}
          />
        </div>

        <div className={styles.infoWrapper}>
          <h2 className={styles.roadmapTitle}>{roadmap.title}</h2>

          <div className={styles.progressBlock}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progress</span>
              <span className={styles.progressPercent}>
                {roadmap.progress}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
            <span className={styles.progressSubtext}>
              {roadmap.completed_games} of {roadmap.total_games} games completed
            </span>
          </div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Est. Time</span>
          <span className={styles.statValue}>
            ~{(roadmap.estimated_time / 60 / 60).toFixed(1)}h
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Games</span>
          <span className={styles.statValue}>{roadmap.total_games}</span>
        </div>
      </div>

      <div className={styles.metaSection}>
        {roadmap.recommended_game && (
          <div className={styles.recommendBox}>
            <span className={styles.recLabel}>Next Up:</span>
            <span className={styles.recGameName}>
              {roadmap.recommended_game.title}
            </span>
          </div>
        )}

        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span
              className={styles.statusDot}
              style={{ background: "#f59e0b" }}
            />
            <span>{roadmap.in_progress} Active</span>
          </div>
          <div className={styles.statusItem}>
            <span
              className={styles.statusDot}
              style={{ background: "#ef4444" }}
            />
            <span>{roadmap.abandoned} Deferred</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
