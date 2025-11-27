import { Pagination } from "../../../../components/ui/Pagination/Pagination";
import { GameCard, type LibraryGame } from "../gameCard/GameCard";
import styles from "./GameSelector.module.css";

interface Props {
  games: LibraryGame[];
  selectedIds: number[];
  onToggle: (id: number) => void;

  searchQuery: string;
  onSearchChange: (val: string) => void;

  page: number;
  totalPages: number;
  setPage: (p: number | ((prev: number) => number)) => void;

  isLoading: boolean;
  maxGames: number;
}

export const GameSelector = ({
  games,
  selectedIds,
  onToggle,
  searchQuery,
  onSearchChange,
  page,
  totalPages,
  setPage,
  isLoading,
  maxGames,
}: Props) => {
  const isMaxReached = selectedIds.length >= maxGames;
  const isValidCount =
    selectedIds.length >= 3 && selectedIds.length <= maxGames;

  return (
    <div className={styles.section}>
      <div className={styles.gamesHeader}>
        <label className={styles.label}>
          Select Games
          <span
            className={isValidCount ? styles.countValid : styles.countInvalid}
          >
            ({selectedIds.length}/{maxGames})
          </span>
        </label>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search library..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.gamesContainer}>
        {isLoading ? (
          <div className={styles.loading}>Loading library...</div>
        ) : games.length === 0 ? (
          <div className={styles.emptySearch}>No games found.</div>
        ) : (
          <div className={styles.gamesGrid}>
            {games.map((game) => {
              const isSelected = selectedIds.includes(game.id);
              const isDisabled = !isSelected && isMaxReached;

              return (
                <GameCard
                  key={game.id}
                  game={game}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            page={page}
            totalPages={totalPages}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => p - 1)}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};
