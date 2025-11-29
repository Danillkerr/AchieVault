import { GuideViewer } from "../GuideViewer";
import type { Guide } from "@/types/guide.interface";
import type { User } from "@/types/user.interface";
import styles from "./GuideDetails.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  guide: Guide;
  currentUser: User | null;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const GuideDetails = ({
  guide,
  currentUser,
  onBack,
  onEdit,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const isMyGuide = currentUser && guide.user.id === Number(currentUser.id);

  return (
    <div className={styles.readView}>
      <div className={styles.readHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← {t("game.guides.back")}
        </button>

        {isMyGuide && (
          <div className={styles.cardActions}>
            <button className={styles.editBtnLink} onClick={onEdit}>
              {t("game.guides.edit")}
            </button>
            <button className={styles.deleteBtnLink} onClick={onDelete}>
              {t("game.guides.delete")}
            </button>
          </div>
        )}
      </div>

      <div className={styles.article}>
        <h1 className={styles.articleTitle}>{guide.title}</h1>
        <div className={styles.articleMeta}>
          <img src={guide.user.avatar} className={styles.authorAvatar} alt="" />
          <div className={styles.metaText}>
            <span className={styles.authorName}>{guide.user.name}</span>
            <span className={styles.date}>
              {new Date(guide.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <hr className={styles.divider} />

        <GuideViewer content={guide.text} />
      </div>
    </div>
  );
};
