import { BaseWidget } from "../../../components/widgets/BaseWidget";
import type { User } from "../../../types/user.interface";
import styles from "./SearchWidgets.module.css";

interface Props {
  users: User[];
}

export const UserListWidget = ({ users }: Props) => {
  return (
    <BaseWidget title="Users">
      <div className={`${styles.tableHeader} ${styles.gridUsers}`}>
        <span>User</span>
        <span className={styles.colRight}>100%</span>
        <span className={styles.colRight}>Total</span>
      </div>

      <div className={styles.list}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>No users found</div>
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
