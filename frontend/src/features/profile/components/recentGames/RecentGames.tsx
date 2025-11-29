import type { RecentGame } from "@/types/profile.interface";
import { Link } from "react-router-dom";
import styles from "./RecentGames.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  games: RecentGame[];
}

export const RecentGames = ({ games }: Props) => {
  const { t } = useTranslation();

  const getCoverUrl = (logoCode: string) => {
    if (!logoCode)
      return "https://images.igdb.com/igdb/image/upload/t_1080p/nocover.png";
    return `https://images.igdb.com/igdb/image/upload/t_1080p/${logoCode}.jpg`;
  };

  return (
    <section>
      <h2 className={styles.sectionTitle}>{t("profile.recent_games")}</h2>

      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.steam_id}`}
            className={styles.gameCard}
          >
            <div className={styles.coverWrapper}>
              <img
                src={getCoverUrl(game.logo || "")}
                alt={game.title}
                className={styles.gameCover}
              />
              <div className={styles.overlayPercent}>
                {game.completion_percent}%
              </div>
            </div>

            <div className={styles.gameMeta}>
              <h4 className={styles.gameTitle}>{game.title}</h4>

              <div className={styles.gameStatsRow}>
                <div className={styles.gsItem}>
                  <div className={styles.gsLabel}>{t("profile.playtime")}</div>
                  <div className={styles.gsValue}>
                    {(game.playtime_forever / 60).toFixed(1)}
                    {t("common.hours_short")}
                  </div>
                </div>
                <div className={styles.gsItem}>
                  <div className={styles.gsLabel}>
                    {t("profile.achievements")}
                  </div>
                  <div className={styles.gsValue}>
                    {game.achievements_unlocked}/{game.achievements_total}
                  </div>
                </div>
                <div className={styles.gsItem}>
                  <div className={styles.gsLabel}>
                    {t("profile.completion")}
                  </div>
                  <div className={styles.gsValue}>
                    {game.completion_percent}%
                  </div>
                </div>
              </div>

              <div className={styles.miniProgress}>
                <div
                  className={styles.miniFill}
                  style={{ width: `${game.completion_percent}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
