import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuthContext";
import { useGameData } from "../../hooks/useGameData";
import { ScreenLoader } from "../../components/feedback/ScreenLoader/ScreenLoader";
import { AchievementItem } from "../../features/game/components/AchievementItem";
import styles from "./GamePage.module.css";
import { useGameAchievements } from "../../hooks/useGameAchievements";

type Tab = "achievements" | "backlog" | "guide";

export const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { isAuthenticated } = useAuth();
  const { game, isLoading: gameLoading } = useGameData(gameId);
  const { allAchievements, backlog } = useGameAchievements(gameId);
  const [activeTab, setActiveTab] = useState<Tab>("achievements");

  if (gameLoading) return <ScreenLoader text="Loading game data..." />;
  if (!game) return <div className={styles.error}>Game not found</div>;

  const displayRating = Math.round(game.rating);

  return (
    <div className={styles.gamePage}>
      <section className={styles.heroSection}>
        <div
          className={styles.heroBackground}
          style={{
            backgroundImage: `url(${
              "https://images.igdb.com/igdb/image/upload/t_1080p/" +
              game.logo +
              ".jpg"
            })`,
          }}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <img
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${game.logo}.jpg`}
            alt={game.title}
            className={styles.poster}
          />

          <div className={styles.details}>
            <h1 className={styles.title}>{game.title}</h1>

            <div className={styles.statsRow}>
              {game.rating > 0 && (
                <div className={styles.statBadge} title="Rating">
                  {game.rating > 0 && (
                    <div
                      className={`${styles.ratingBox} ${getRatingClass(
                        displayRating
                      )}`}
                      title="IGDB Rating"
                    >
                      {displayRating}
                    </div>
                  )}
                </div>
              )}

              {game.time_to_beat > 0 && (
                <div className={styles.statBadge} title="Average time to beat">
                  <span>~{(game.time_to_beat / 60 / 60).toFixed(1)} hours</span>
                </div>
              )}

              {game.steam_id && (
                <a
                  href={`steam://store/${game.steam_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.storeLink}
                >
                  Steam ↗
                </a>
              )}

              {game.url && (
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.igdbLink}
                >
                  IGDB Info
                </a>
              )}
            </div>

            <div className={styles.summaryBox}>
              <h3 className={styles.summaryTitle}>About</h3>
              <p className={styles.summaryText}>
                {game.summary || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "achievements" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
            <span className={styles.badge}>{allAchievements.length}</span>
          </button>

          {isAuthenticated && (
            <button
              className={`${styles.tab} ${
                activeTab === "backlog" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("backlog")}
            >
              Backlog
              <span className={`${styles.badge} ${styles.badgeBacklog}`}>
                {backlog.length}
              </span>
            </button>
          )}

          <button
            className={`${styles.tab} ${
              activeTab === "guide" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("guide")}
          >
            Guide
          </button>
        </div>
      </nav>

      <div className={styles.contentArea}>
        {activeTab === "achievements" && (
          <div className={styles.achievementsGrid}>
            {allAchievements.map((ach) => (
              <AchievementItem key={ach.apiName} item={ach} />
            ))}
          </div>
        )}

        {activeTab === "backlog" && isAuthenticated && (
          <div className={styles.achievementsGrid}>
            {backlog.length === 0 ? (
              <div className={styles.completedMsg}>
                All achievements completed!
              </div>
            ) : (
              backlog.map((ach) => (
                <AchievementItem key={ach.apiName} item={ach} />
              ))
            )}
          </div>
        )}

        {activeTab === "guide" && (
          <div className={styles.placeholder}>
            Guides functionality coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

const getRatingClass = (rating: number) => {
  if (rating >= 75) return styles.bgHigh;
  if (rating >= 50) return styles.bgMid;
  return styles.bgLow;
};
