import styles from "./Pagination.module.css";

interface Props {
  page: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

export const Pagination = ({
  page,
  totalPages,
  onNext,
  onPrev,
  isLoading,
}: Props) => {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={onPrev}
        disabled={page <= 1 || isLoading}
      >
        « Prev
      </button>

      <span className={styles.info}>
        Page {page} of {totalPages || 1}
      </span>

      <button
        className={styles.button}
        onClick={onNext}
        disabled={page >= totalPages || isLoading}
      >
        Next »
      </button>
    </div>
  );
};
