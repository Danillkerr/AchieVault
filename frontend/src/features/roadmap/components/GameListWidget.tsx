import { useState } from "react";
import type { RoadmapGame } from "../../../types/roadmap.interface";
import { GamesModal } from "./GamesModal";
import styles from "./RoadmapComponents.module.css";

export const GameListWidget = ({ games }: { games: RoadmapGame[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.listWidget}>
        <h3 className={styles.widgetTitle}>Game List</h3>
        <div className={styles.widgetContent}>
          {games.slice(0, 4).map((game) => (
            <div key={game.id} className={styles.widgetRow}>
              <img
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`}
                className={styles.widgetCover}
                alt=""
              />
              <div className={styles.widgetInfo}>
                <span className={styles.widgetGameTitle}>{game.title}</span>
                <span className={styles.widgetScore}>
                  🏆 {game.achievements_total}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.moreBtn} onClick={() => setIsOpen(true)}>
          View All ({games.length})
        </button>
      </div>
      <GamesModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        games={games}
      />
    </>
  );
};
