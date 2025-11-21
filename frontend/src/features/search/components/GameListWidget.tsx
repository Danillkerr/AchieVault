import { Link } from "react-router-dom";
import { BaseWidget } from "../../../components/widgets/BaseWidget";
import type { Game } from "../../../types/game.interface";
import styles from "./SearchWidgets.module.css";

interface Props {
  games: Game[];
}

export const GameListWidget = ({ games }: Props) => {
  const getRatingColorClass = (rating: number) => {
    if (rating >= 80) return styles.ratingHigh;
    if (rating >= 50) return styles.ratingMid;
    return styles.ratingLow;
  };

  return (
    <BaseWidget title="Games">
      <div className={`${styles.tableHeader} ${styles.gridGames}`}>
        <span>Game Title</span>
        <span className={styles.colRight}>Rating</span>
      </div>

      <div className={styles.list}>
        {games.length === 0 ? (
          <div className={styles.emptyState}>No games found</div>
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
