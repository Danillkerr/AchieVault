import { Link } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          AchieVault
        </Link>
        <nav>
          <Link to="/global-ranking" className={styles.navLink}>
            Global ranking
          </Link>
        </nav>
      </div>
      <div className={styles.right}>
        <input
          type="search"
          placeholder="Search..."
          className={styles.search}
        />
        <Link to="/profile" className={styles.profileIcon}>
          P
        </Link>
      </div>
    </header>
  );
};
