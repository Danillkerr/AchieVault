import { BaseWidget } from "@/components/widgets/BaseWidget";
import type { User } from "@/types/user.interface";
import styles from "./SearchWidgets.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  users: User[];
}

export const UserListWidget = ({ users }: Props) => {
  const { t } = useTranslation();

  return (
    <BaseWidget title={t("search.users")}>
      <div className={`${styles.tableHeader} ${styles.gridUsers}`}>
        <span>{t("search.users")}</span>
        <span className={styles.colRight}>{t("search.games")}</span>
        <span className={styles.colRight}>{t("search.achievements")}</span>
      </div>

      <div className={styles.list}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>{t("search.no_users")}</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className={`${styles.row} ${styles.gridUsers}`}>
              <div className={styles.userInfo}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={styles.avatar}
                />
                <span className={styles.username}>{user.name}</span>
              </div>

              <div className={styles.statValue} title="Perfect Games">
                {user.completed_count}
              </div>

              <div className={styles.statValue} title="Total Achievements">
                {user.achievement_count}
              </div>
            </div>
          ))
        )}
      </div>
    </BaseWidget>
  );
};
