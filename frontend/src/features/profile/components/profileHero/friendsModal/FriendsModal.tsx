import { useState } from "react";
import type { FriendRank } from "@/types/profile.interface";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import styles from "./FriendsModal.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  friends: FriendRank[];
  mode: "perfect" | "total";
}

export const FriendsModal = ({ isOpen, onClose, friends, mode }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const totalPages = Math.ceil(friends.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentFriends = friends.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>
            {t("profile.friends_ranking")} (
            {mode === "perfect"
              ? t("profile.completed")
              : t("profile.achievements")}
            )
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalList}>
          {currentFriends.map((f) => (
            <div key={f.id} className={styles.modalRow}>
              <span className={styles.rankNumber}>#{f.rank}</span>
              <img src={f.user.avatar} alt="" className={styles.modalAvatar} />
              <span className={styles.friendName}>{f.user.name}</span>
              <span className={styles.friendScore}>{f.value}</span>
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
