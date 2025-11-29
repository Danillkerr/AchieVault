import { Link } from "react-router-dom";
import styles from "./RoadmapBanner.module.css";
import type { UserRoadmap } from "@/types/profile.interface";
import { useTranslation } from "react-i18next";

interface Props {
  roadmap?: UserRoadmap | null;
}

export const RoadmapBanner = ({ roadmap }: Props) => {
  const { t } = useTranslation();

  if (!roadmap) {
    return (
      <Link
        to="/profile/create-roadmap"
        className={`${styles.roadmapContainer} ${styles.emptyState}`}
      >
        <div className={styles.emptyContent}>
          <div className={styles.emptyText}>
            <h3>{t("roadmap.banner_title")}</h3>
            <p>{t("roadmap.banner_text")}</p>
          </div>
          <span className={styles.createFakeBtn}>
            {t("roadmap.banner_btn")}
          </span>
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
              <span className={styles.progressLabel}>
                {t("roadmap.progress")}
              </span>
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
              {roadmap.completed_games}/{roadmap.total_games}{" "}
              {t("profile.games_completed")}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>{t("roadmap.est_time")}</span>
          <span className={styles.statValue}>
            ~{(roadmap.estimated_time / 60 / 60).toFixed(1)}
            {t("common.hours_short")}
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>{t("roadmap.total_games")}</span>
          <span className={styles.statValue}>{roadmap.total_games}</span>
        </div>
      </div>

      <div className={styles.metaSection}>
        {roadmap.recommended_game && (
          <div className={styles.recommendBox}>
            <span className={styles.recLabel}>{t("roadmap.next_up")}:</span>
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
            <span>
              {roadmap.in_progress} {t("roadmap.active")}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span
              className={styles.statusDot}
              style={{ background: "#ef4444" }}
            />
            <span>
              {roadmap.abandoned} {t("roadmap.deferred")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
