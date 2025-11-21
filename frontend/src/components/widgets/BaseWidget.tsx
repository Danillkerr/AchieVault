import type { ReactNode } from "react";
import styles from "./BaseWidget.module.css";

interface BaseWidgetProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const BaseWidget = ({
  title,
  children,
  action,
  className = "",
}: BaseWidgetProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};
