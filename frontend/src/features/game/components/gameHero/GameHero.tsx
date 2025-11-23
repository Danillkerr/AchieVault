import type { Game } from "../../../../types/game.interface";
import styles from "./GameHero.module.css";

interface Props {
  game: Game;
}

export const GameHero = ({ game }: Props) => {
  const displayRating = Math.round(game.rating);

  const getRatingClass = (rating: number) => {
    if (rating >= 75) return styles.bgHigh;
    if (rating >= 50) return styles.bgMid;
    return styles.bgLow;
  };

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.heroBackground}
        style={{
          backgroundImage: `url(https://images.igdb.com/igdb/image/upload/t_1080p/${game.logo}.jpg)`,
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
                <div
                  className={`${styles.ratingBox} ${getRatingClass(
                    displayRating
                  )}`}
                >
                  {displayRating}
                </div>
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
  );
};
