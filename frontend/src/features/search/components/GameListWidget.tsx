import { Link } from "react-router-dom";
import { BaseWidget } from "../../../components/widgets/BaseWidget";
import type { Game } from "../../../types/game.interface";
import styles from "./SearchWidgets.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  games: Game[];
}

export const GameListWidget = ({ games }: Props) => {
  const { t } = useTranslation();
  const getRatingColorClass = (rating: number) => {
    if (rating >= 80) return styles.ratingHigh;
    if (rating >= 50) return styles.ratingMid;
    return styles.ratingLow;
  };

  return (
    <BaseWidget title={t("search.games")}>
      <div className={`${styles.tableHeader} ${styles.gridGames}`}>
        <span>{t("search.games")}</span>
        <span className={styles.colRight}>{t("search.rating")}</span>
      </div>

      <div className={styles.list}>
        {games.length === 0 ? (
          <div className={styles.emptyState}>{t("search.no_games")}</div>
        ) : (
          games.map(
            (game) =>
              game.title !== "Unknown Title" && (
                <Link
                  key={game.steam_id}
                  to={`/game/${game.steam_id}`}
                  className={`${styles.row} ${styles.gridGames}`}
                >
                  <div className={styles.gameContent}>
                    <img
                      src={
                        "https://images.igdb.com/igdb/image/upload/t_1080p/" +
                        game.logo +
                        ".jpg"
                      }
                      alt={game.title}
                      className={styles.gameCover}
                    />
                    <span className={styles.gameTitle}>{game.title}</span>
                  </div>
                  <div
                    className={`${styles.statValue} ${getRatingColorClass(
                      game.rating
                    )}`}
                  >
                    {game.rating == 0.0 ? "N/A" : `${game.rating}%`}
                  </div>
                </Link>
              )
          )
        )}
      </div>
    </BaseWidget>
  );
};
