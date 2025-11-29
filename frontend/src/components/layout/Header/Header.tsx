import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "@/context/useAuthContext";
import { SearchForm } from "@/components/feedback/SearchForm/SearchForm";

export const Header = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

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
        <SearchForm variant="header" />
        {!isLoading && isAuthenticated && (
          <Link to="/profile" className={styles.profileIcon}>
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className={styles.avatarImage}
              />
            )}
          </Link>
        )}
      </div>
    </header>
  );
};
