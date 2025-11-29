import styles from "./Pagination.module.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        onClick={onPrev}
        disabled={page <= 1 || isLoading}
      >
        {t("pagination.prev")}
      </button>

      <span className={styles.info}>
        {t("pagination.info", { page, total: totalPages || 1 })}
      </span>

      <button
        className={styles.button}
        onClick={onNext}
        disabled={page >= totalPages || isLoading}
      >
        {t("pagination.next")}
      </button>
    </div>
  );
};
