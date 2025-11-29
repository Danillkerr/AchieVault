import { Pagination } from "@/components/ui/Pagination/Pagination";
import type { Guide } from "@/types/guide.interface";
import type { User } from "@/types/user.interface";
import styles from "./GuideList.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  guides: Guide[];
  loading: boolean;
  currentUser: User | null;
  onSelect: (guide: Guide) => void;
  onCreate: () => void;
  pagination: {
    page: number;
    totalPages: number;
    setPage: (page: number | ((p: number) => number)) => void;
  };
}

export const GuideList = ({
  guides,
  loading,
  currentUser,
  onSelect,
  onCreate,
  pagination,
}: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.guideHeader}>
        <h3>{t("game.guides.title")}</h3>
        {currentUser && (
          <button className={styles.createBtn} onClick={onCreate}>
            + {t("game.guides.create")}
          </button>
        )}
      </div>

      <div className={styles.guideList}>
        {loading ? (
          <div className={styles.placeholder}>{t("loading.guides")}</div>
        ) : guides.length === 0 ? (
          <p className={styles.placeholder}>{t("game.guides.no_guides")}</p>
        ) : (
          guides.map((guide) => {
            const isMyGuide =
              currentUser && guide.user.id === Number(currentUser.id);

            return (
              <div
                key={guide.id}
                className={`${styles.guideCard} ${
                  isMyGuide ? styles.myGuideCard : ""
                }`}
                onClick={() => onSelect(guide)}
              >
                <div className={styles.guideCardContent}>
                  <h4 className={styles.guideTitle}>
                    {guide.title}
                    {isMyGuide && (
                      <span className={styles.myBadge}>{t("profile.you")}</span>
                    )}
                  </h4>
                </div>

                <div className={styles.guideMeta}>
                  <span>
                    {t("game.guides.by")} {guide.user.name}
                  </span>
                  <span>•</span>
                  <span>{new Date(guide.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!loading && guides.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={() => pagination.setPage((p) => p + 1)}
            onPrev={() => pagination.setPage((p) => p - 1)}
            isLoading={loading}
          />
        </div>
      )}
    </>
  );
};
