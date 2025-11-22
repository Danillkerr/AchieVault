import { Link } from "react-router-dom";
import { BaseWidget } from "../../../components/widgets/BaseWidget";
import type { TrendingGame } from "../../../types/game.interface";
import styles from "./Widgets.module.css";
import { formatCompactNumber } from "../../../utils/format";

interface Props {
  games: TrendingGame[];
}

export const TrendingWidget = ({ games }: Props) => {
  return (
    <BaseWidget title="Trending Games">
      <div className={styles.list}>
        {games.map((game) => {
          if (game.title !== "Unknown Title") {
            return (
              <Link
                key={game.steam_id}
                className={styles.gameRow}
                to={`/game/${game.steam_id}`}
              >
                <img
                  src={
                    "https://images.igdb.com/igdb/image/upload/t_1080p/" +
                    game.logo +
                    ".jpg"
                  }
                  alt={game.title}
                  className={styles.gameCover}
                />

                <div className={styles.gameInfo}>
                  <span className={styles.gameTitle}>{game.title}</span>
                  <span className={styles.onlineCount}>
                    <span className={styles.onlineDot}></span>
                    {formatCompactNumber(game.currentPlayers)} playing
                  </span>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </BaseWidget>
  );
};
