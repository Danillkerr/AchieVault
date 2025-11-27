import styles from "./GameCard.module.css";

export interface LibraryGame {
  id: number;
  steam_id: string;
  title: string;
  logo: string;
}

interface Props {
  game: LibraryGame;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (id: number) => void;
}

export const GameCard = ({ game, isSelected, isDisabled, onToggle }: Props) => {
  const getCoverUrl = (logoCode: string) => {
    if (!logoCode)
      return "https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png";
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${logoCode}.jpg`;
  };

  return (
    <div
      className={`
        ${styles.gameItem} 
        ${isSelected ? styles.selected : ""}
        ${isDisabled ? styles.disabledItem : ""}
      `}
      onClick={() => !isDisabled && onToggle(game.id)}
    >
      <div className={styles.coverWrapper}>
        <img
          src={getCoverUrl(game.logo)}
          alt={game.title}
          className={styles.gameCover}
        />
        {isSelected && (
          <div className={styles.overlaySelected}>
            <span className={styles.checkmark}>✔</span>
          </div>
        )}
      </div>
      <span className={styles.gameTitle} title={game.title}>
        {game.title}
      </span>
    </div>
  );
};
