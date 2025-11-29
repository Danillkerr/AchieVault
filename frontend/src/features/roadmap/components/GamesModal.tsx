import { useState } from "react";
import type { RoadmapGame } from "@/types/roadmap.interface";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import styles from "./GamesModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  games: RoadmapGame[];
}

export const GamesModal = ({ isOpen, onClose, games }: Props) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const totalPages = Math.ceil(games.length / itemsPerPage);
  const currentGames = games.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Full Game List</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalList}>
          {currentGames.map((game) => (
            <div key={game.id} className={styles.modalRow}>
              <img
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`}
                alt=""
                className={styles.modalAvatar}
                style={{ borderRadius: "4px" }}
              />
              <span className={styles.friendName}>{game.title}</span>
              <span className={styles.friendScore}>
                🏆 {game.achievements_total}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.paginationWrapper}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => p - 1)}
          />
        </div>
      </div>
    </div>
  );
};
